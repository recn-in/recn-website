---
title: The desktop app
summary: A real Mac and Windows app, with a three-column shell, keyboard shortcuts, multi-select and right-click menus.
group: Everywhere
order: 2
platforms: [macOS, Windows]
shipped: 2026-09-16
---

Work on a computer is work with two hands. If an app makes you reach for the mouse to do what a key could do, or hides the thing you just selected behind a modal, it is a phone app that happens to have a title bar.

RECN on the desktop is one shell: a navigation rail, the library, whatever is selected, and a player along the bottom that stays put while you move around.

<figure class="mock">
<svg viewBox="0 0 720 440" role="img" aria-label="Line drawing of the RECN desktop window. A narrow left rail lists Library, Notes, Sync and Settings. A header carries the title, a search field and Record and New buttons. The feed below has three rows selected and a right-click menu open over them offering Move to project and Delete three items. A preview pane sits to the right and a player bar runs along the bottom.">
  <!-- rail -->
  <path class="dim" d="M96 0v440"/>
  <text x="20" y="48">LIBRARY</text>
  <text x="20" y="80" class="dim">NOTES</text>
  <text x="20" y="112" class="dim">SYNC</text>
  <text x="20" y="376" class="dim">SETTINGS</text>
  <!-- header -->
  <path class="dim" d="M96 72h624"/>
  <text x="116" y="44">LIBRARY</text>
  <rect x="300" y="28" width="180" height="22" class="dim"/>
  <text x="314" y="44" class="dim">SEARCH</text>
  <rect x="500" y="28" width="86" height="22"/>
  <text x="543" y="44" text-anchor="middle">RECORD</text>
  <rect x="598" y="28" width="60" height="22"/>
  <text x="628" y="44" text-anchor="middle">NEW</text>
  <!-- feed with a three-row selection -->
  <path class="dim" d="M452 72v300"/>
  <rect x="112" y="92" width="324" height="28" class="accent"/>
  <text x="124" y="111" class="accent">REHEARSAL 04</text>
  <rect x="112" y="124" width="324" height="28" class="accent"/>
  <text x="124" y="143" class="accent">TAKE 11</text>
  <rect x="112" y="156" width="324" height="28" class="accent"/>
  <text x="124" y="175" class="accent">ROOM TONE</text>
  <text x="124" y="207">MIX NOTES</text>
  <path class="dim" d="M112 220h324"/>
  <text x="124" y="239">LIVE SET</text>
  <path class="dim" d="M112 252h324"/>
  <!-- the context menu over the selection -->
  <rect x="232" y="180" width="196" height="76"/>
  <text x="250" y="206">MOVE TO PROJECT… (3)</text>
  <path class="dim" d="M232 220h196"/>
  <text x="250" y="242">DELETE 3 ITEMS</text>
  <!-- the pointer -->
  <path d="M236 178l0 20 5-5 4 8 4-2-4-8 7-1z"/>
  <!-- preview pane -->
  <text x="472" y="104">TAKE 11</text>
  <path class="dim" d="M472 160h228"/>
  <path d="M476 146v28M486 136v48M496 152v16M506 130v60M516 144v32M526 138v44M536 150v20M546 132v56M556 146v28M566 140v40M576 148v24M586 134v52M596 146v28M606 138v44M616 150v20M626 136v48M636 144v32M646 140v40M656 148v24M666 134v52M676 146v28M686 142v36"/>
  <path class="accent" d="M566 124v72"/>
  <text x="472" y="224" class="dim">WAV · 48 KHZ · STEREO</text>
  <text x="472" y="252" class="dim">DEMOS</text>
  <!-- player bar -->
  <path class="dim" d="M96 372h624"/>
  <circle cx="132" cy="406" r="14"/>
  <path d="M127 399l12 7-12 7z"/>
  <text x="168" y="410">TAKE 11</text>
  <path class="dim" d="M300 406h340"/>
  <path class="accent" d="M300 406h132"/>
  <circle cx="432" cy="406" r="4" class="accent"/>
  <text x="700" y="410" text-anchor="end">04:18</text>
</svg>
<figcaption>The desktop shell: rail, library, the selected item, the player.</figcaption>
</figure>

## Made with a new item

Command-N asks what you are making. Note, session, project, drawing, recording, or audio to import, each with its own letter to press. Pick one that needs a name and the palette turns into a name field and a project to file it into, in place. You never end up with an untitled thing you have to go rename later.

## Select, right-click, act

Click, Shift-click, Command-click: the same selection every list on the desktop understands. Right-click acts on what is selected, not on whatever was under the cursor, so the menu says how many it will move or delete. Command-F puts the cursor in search from anywhere.

Every shortcut is listed in Settings, written the way your platform writes it. On macOS they are in a real menu bar as well.

## Cursors that tell the truth

The hand cursor means a link and nothing else. Buttons and rows keep the arrow. A waveform shows a crosshair, because there you are pointing at a moment in time. A column divider shows a resize cursor, because it drags.
