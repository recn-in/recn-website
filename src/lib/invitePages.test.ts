import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// The invite pages hold a secret in the URL fragment (RECN ADR-0052): no
// third-party script, no referrer, and the one inline script never puts the
// fragment in the page, a request or storage.
for (const product of ['rec', 'work']) {
  const name = product === 'rec' ? 'Rec' : 'Work';
  const html = readFileSync(`public/i/${product}/index.html`, 'utf8');
  const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];

  test(`/i/${product}/ sends no referrer and loads nothing from elsewhere`, () => {
    assert.match(html, /<meta name="referrer" content="no-referrer">/);
    assert.match(html, /<meta name="robots" content="noindex">/);
    assert.doesNotMatch(html, /(src|href)="(https?:)?\/\//);
    assert.match(html, new RegExp(`<h1>Open in RECN ${name}</h1>`));
    assert.match(html, /If RECN did not open, copy this link and paste it into the app\./);
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

  test(`/i/${product}/ never writes the link into the page, a request or storage`, () => {
    const [, , body] = scripts[0];
    for (const banned of [
      'hash', 'search', 'innerHTML', 'outerHTML', 'insertAdjacent', 'document.write', 'setAttribute',
      'fetch', 'XMLHttpRequest', 'sendBeacon', 'WebSocket', 'Image', 'Storage', 'cookie', 'indexedDB',
      'history', 'postMessage', 'open(',
    ]) {
      assert.ok(!body.includes(banned), `the script uses ${banned}`);
    }
    assert.equal(body.match(/location\.href/g)?.length, 1);
    assert.match(body, /navigator\.clipboard\.writeText\(location\.href\)/);
  });
}

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
