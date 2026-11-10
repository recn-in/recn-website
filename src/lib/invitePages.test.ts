import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// The invite pages hold a secret in the URL fragment (RECN ADR-0052): no
// third-party script, no referrer, and the one inline script never puts the
// fragment in a request or storage. It shows only the names, role and expiry
// the link carries, as text.
const pages = Object.fromEntries(
  ['rec', 'work'].map((product) => [product, readFileSync(`public/i/${product}/index.html`, 'utf8')]),
);
const scriptOf = (html: string) => [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];

for (const [product, html] of Object.entries(pages)) {
  const name = product === 'rec' ? 'Rec' : 'Work';
  const scripts = scriptOf(html);

  test(`/i/${product}/ sends no referrer and loads nothing from elsewhere`, () => {
    assert.match(html, /<meta name="referrer" content="no-referrer">/);
    assert.match(html, /<meta name="robots" content="noindex">/);
    assert.doesNotMatch(html, /src="(https?:)?\/\//);
    for (const [, href] of html.matchAll(/href="((?:https?:)?\/\/[^"]*)"/g)) {
      assert.match(href, /^https:\/\/(testflight\.apple\.com|play\.google\.com)\//, href);
    }
    for (const [anchor] of html.matchAll(/<a [^>]*>/g)) assert.match(anchor, /rel="noreferrer"/);
    assert.match(html, new RegExp(`<h1 id="title">Open in RECN ${name}</h1>`));
    assert.match(html, new RegExp(`copy the link and paste it into RECN ${name}\\.`));
  });

  test(`/i/${product}/ runs only its own pinned inline script`, () => {
    assert.equal(scripts.length, 1);
    const [, attributes, body] = scripts[0];
    assert.equal(attributes, '');
    const hash = createHash('sha256').update(body, 'utf8').digest('base64');
    const csp = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]*)">/)?.[1];
    assert.equal(
      csp,
      `default-src 'none'; script-src 'sha256-${hash}'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; form-action 'none'`,
    );
  });

  test(`/i/${product}/ never sends or stores the link, and writes only text`, () => {
    const [, , body] = scripts[0];
    for (const banned of [
      'search', 'innerHTML', 'outerHTML', 'insertAdjacent', 'document.write', 'setAttribute', 'href =',
      'fetch', 'XMLHttpRequest', 'sendBeacon', 'WebSocket', 'Image', 'Storage', 'cookie', 'indexedDB',
      'history', 'postMessage', 'open(', 'console',
    ]) {
      assert.ok(!body.includes(banned), `the script uses ${banned}`);
    }
    assert.equal(body.match(/hash/g)?.length, 1);
    assert.match(body, /var fragment = location\.hash\.slice\(1\);/);
    assert.equal(body.match(/location\.href/g)?.length, 1);
    assert.match(body, /navigator\.clipboard\.writeText\(location\.href\)/);
  });
}

test('both pages run the same script', () => {
  assert.equal(scriptOf(pages.rec)[0][2], scriptOf(pages.work)[0][2]);
});

// The same fragment the RECN repo pins in invite_link_test.dart ("a link
// holds the layout recn.in reads"): a Work invite to "Album demos · Ş" from
// Shubham, Can edit, expiring 2030-01-01T00:00:00Z.
const vector =
  'AgEBAAGTEfmO5Nl4bp_I-lS2Nc8AAZMR-Y7k2Xhun8j6VLY10AABAgMEBQYHCAkKCwwN' +
  'Dg8QERITFBUWFxgZGhscHR4fgOiW1o03AghwZXJzb24tMQEgAQEBAQEBAQEBAQEBAQEB' +
  'AQEBAQEBAQEBAQEBAQEBAQECAQKqESRodHRwczovL2V1dzEtMS5yZWxheS5pcm9oLm5l' +
  'dHdvcmsuLwECuyIAEUFsYnVtIGRlbW9zIMK3IMWeB1NodWJoYW3__v38-_r5-Pf29fTz' +
  '8vHw7-7t7Ovq6ejn5uXk4-Lh4N_e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHA';

/** Runs a page's script against a stand-in DOM; returns what it shows. */
function open(product: string, fragment: string, now = Date.UTC(2026, 10, 10)) {
  const elements = new Map<string, { textContent: string; hidden: boolean; classes: string[] }>();
  const element = (id: string) => {
    if (!elements.has(id)) elements.set(id, { textContent: '', hidden: true, classes: [] });
    const el = elements.get(id)!;
    return Object.assign(el, { classList: { add: (c: string) => el.classes.push(c) }, addEventListener() {} });
  };
  const RealDate = Date;
  const FixedDate = class extends RealDate {
    static now() { return now; }
  };
  const href = `https://recn.in/i/${product}/${fragment ? `#${fragment}` : ''}`;
  vm.runInNewContext(scriptOf(pages[product])[0][2], {
    location: { pathname: `/i/${product}/`, hash: fragment ? `#${fragment}` : '', href },
    document: { getElementById: element },
    navigator: { clipboard: { writeText: () => Promise.resolve() } },
    atob, TextDecoder, Uint8Array, Intl, Date: FixedDate,
  });
  const text = (id: string) => elements.get(id)?.textContent ?? '';
  return { text, shown: (id: string) => elements.get(id)?.hidden === false, classes: elements.get('invite')?.classes ?? [], elements };
}

test('an invite shows its project, inviter, role and expiry', () => {
  const page = open('work', vector);
  assert.equal(page.text('title'), 'Album demos · Ş');
  assert.equal(page.text('lede'), 'Shubham invited you to this project in RECN Work.');
  assert.equal(page.text('project'), 'Album demos · Ş');
  assert.equal(page.text('from'), 'Shubham');
  assert.equal(page.text('role'), 'Can edit');
  assert.match(page.text('expires'), /2030|2029/);
  assert.ok(page.shown('details') && page.shown('note'));
  assert.deepEqual(page.classes, []);
  // Nothing but those names reaches the page: no id, key, relay or secret.
  const shown = [...page.elements.values()].map((el) => el.textContent).join('\n');
  for (const hidden of ['person-1', 'relay', 'iroh', '01JC8ZK3', vector.slice(0, 12)]) {
    assert.ok(!shown.includes(hidden), hidden);
  }
});

test('an expired invite says so', () => {
  const page = open('work', vector, Date.UTC(2031, 0, 1));
  assert.match(page.text('expires'), /^Expired /);
  assert.equal(page.text('lede'), 'This invite from Shubham has expired. Ask them for a new link.');
  assert.deepEqual(page.classes, ['is-expired']);
});

test('an invite opened on the other app\'s page is called damaged', () => {
  const page = open('rec', vector);
  assert.equal(page.text('title'), 'This link is damaged');
  assert.ok(!page.shown('details'));
});

test('a link that does not read keeps the plain page', () => {
  const json = Buffer.from('{"product":"rec"}').toString('base64url');
  for (const fragment of [json, vector.slice(0, 40), '***']) {
    const page = open('work', fragment);
    assert.equal(page.text('title'), '', fragment);
    assert.match(page.text('lede'), /could not read the invite/);
    assert.ok(!page.shown('details'));
  }
  assert.equal(open('rec', '').text('lede'), '');
});

test('each app claims only its own invite path', () => {
  const aasa = JSON.parse(readFileSync('public/.well-known/apple-app-site-association', 'utf8'));
  const paths = Object.fromEntries(
    aasa.applinks.details.map((d: { appIDs: string[]; components: { '/': string }[] }) => [
      d.appIDs.join(' '),
      d.components.map((c) => c['/']),
    ]),
  );
  assert.deepEqual(Object.values(paths), [['/i/rec/*'], ['/i/work/*']]);
  const links = JSON.parse(readFileSync('public/.well-known/assetlinks.json', 'utf8'));
  assert.deepEqual(
    links.map((l: { target: { package_name: string } }) => l.target.package_name),
    ['com.recn.rec', 'in.recn.work'],
  );
});
