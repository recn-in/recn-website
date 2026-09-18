---
title: Drawing canvas
summary: A whiteboard for shapes, lines, text and sketches that lives in the library like everything else.
group: Notes
order: 2
platforms: [macOS, Windows, iPhone, iPad, Android]
shipped: 2026-09-17
---

Some ideas are not words. A song structure is boxes and arrows. A stage plot is a floor plan. A mix note is a circle around the second chorus.

A drawing in RECN is its own kind of item, beside recordings, notes and sessions. It has a name, it lives in a project, it shows up in the feed and in search, and it syncs.

<figure class="mock">
<svg viewBox="0 0 720 420" role="img" aria-label="Line drawing of the RECN canvas: an infinite board holding labelled boxes joined by a bent arrow, a dashed frame, a freehand circle and a selected shape with handles. Small floating islands hold the tools, undo and redo, zoom, and the selected shape's properties.">
  <!-- a frame: a labelled dashed rect -->
  <rect x="70" y="70" width="400" height="200" class="dim dash"/>
  <text x="70" y="62">SONG · V2</text>
  <!-- boxes and a connector that bends around the middle one -->
  <rect x="100" y="120" width="92" height="46"/><text x="146" y="147" text-anchor="middle">INTRO</text>
  <rect x="236" y="120" width="92" height="46"/><text x="282" y="147" text-anchor="middle">VERSE</text>
  <rect x="352" y="196" width="92" height="46"/><text x="398" y="223" text-anchor="middle">CHORUS</text>
  <path d="M192 143h44"/><path d="M230 139l6 4-6 4"/>
  <path d="M282 166v53h70"/><path d="M346 215l6 4-6 4"/>
  <!-- a selected shape with its handles -->
  <ellipse cx="560" cy="150" rx="58" ry="34"/>
  <rect x="498" y="112" width="124" height="76" class="accent dash"/>
  <path class="accent" d="M495 109h6v6h-6zM619 109h6v6h-6zM495 185h6v6h-6zM619 185h6v6h-6z"/>
  <text x="560" y="153" text-anchor="middle">BRIDGE?</text>
  <!-- a freehand stroke -->
  <path class="accent" d="M330 232c-6-34 40-58 84-50 46 8 62 44 40 68-24 26-96 24-118-4-6-8-8-12-6-14"/>
  <!-- properties island, top right -->
  <rect x="566" y="22" width="132" height="58"/>
  <circle cx="586" cy="42" r="6"/><circle cx="608" cy="42" r="6" class="accent"/><circle cx="630" cy="42" r="6" class="dim"/><circle cx="652" cy="42" r="6" class="dim"/>
  <path d="M580 64h24"/><path d="M616 64h24" stroke-width="2.4"/><path d="M652 64h24" stroke-width="4"/>
  <!-- history, tools and zoom islands along the bottom -->
  <rect x="22" y="368" width="68" height="32"/><path d="M48 384h-12m4-5l-5 5 5 5M64 384h12m-4-5l5 5-5 5"/>
  <rect x="190" y="368" width="340" height="32"/>
  <path d="M207 376l6 15 3-6 6-3z"/><path class="dim" d="M224 368v32M258 368v32M292 368v32M326 368v32M360 368v32M394 368v32M428 368v32M462 368v32M496 368v32"/>
  <path d="M236 378c6-3 10 3 5 7s-1 9 6 6"/><path d="M268 392l12-14 4 4-12 12z"/><path d="M302 378h14v12h-14z"/>
  <rect x="335" y="377" width="16" height="14"/><ellipse cx="377" cy="384" rx="9" ry="7"/>
  <path d="M403 391l14-14m-6 0h6v6"/><path d="M437 391l14-14"/><text x="479" y="388" text-anchor="middle">T</text><rect x="505" y="377" width="16" height="14" class="dash"/>
  <rect x="610" y="368" width="88" height="32"/><path d="M624 384h8M676 384h8m-4-4v8"/><text x="654" y="387" text-anchor="middle">100%</text>
</svg>
<figcaption>The canvas, with its floating islands: properties, undo and redo, tools, zoom.</figcaption>
</figure>

## What you can draw

- Shapes, lines and arrows, with labels that stay attached when you move them.
- Lines that bend, so a connector can go around something instead of through it.
- Text, anywhere on the canvas.
- Freehand strokes. Apple Pencil pressure is respected on iPad.
- Images, placed and resized directly.

The canvas has no edges. Pan and zoom as far as the idea goes.

## It fits the device

On a desktop the canvas is pointer and keyboard: hover, context menus, shortcuts, undo and redo. On a phone or iPad it is touch and Pencil, with the tools in small floating islands that move out of the way on a small or rotating screen. On the desktop a drawing can open in its own window.

## Two devices, one drawing

Every shape merges on its own. Draw on the iPad while someone rearranges the same canvas on the Mac, and both sets of changes are there when the devices meet. Undo only ever undoes what you did on the device in your hand.

## In a note

A drawing can be placed inside a note, next to the paragraphs it explains.
