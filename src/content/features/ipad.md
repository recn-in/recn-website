---
title: RECN on iPad
summary: On a wide iPad the app becomes three panes, and a note, a session or a recording opens beside the list instead of on top of it.
group: Everywhere
order: 1
platforms: [iPad]
shipped: 2026-09-17
---

An iPad is not a large phone. A phone layout on a 13-inch screen means one item at a time, a full-screen editor every time you tap, and the list you were working through gone the moment you open something from it.

Above 900 points wide, RECN lays itself out in three: navigation, the list, and whatever you selected.

<figure class="mock">
<svg viewBox="0 0 720 420" role="img" aria-label="Line drawing of RECN on a landscape iPad. A left sidebar lists Library, Notes, a Projects section and Sync. A middle list column shows recordings and notes with one row selected. The right pane holds the selected recording's player: a waveform with a playhead, a transport row and a duration.">
  <rect x="0.5" y="0.5" width="719" height="419" class="dim"/>
  <!-- sidebar -->
  <path class="dim" d="M168 0v420"/>
  <text x="24" y="44">LIBRARY</text>
  <text x="140" y="44" text-anchor="end" class="dim">31</text>
  <text x="24" y="76">NOTES</text>
  <text x="140" y="76" text-anchor="end" class="dim">8</text>
  <path class="dim" d="M24 96h120"/>
  <text x="24" y="120" class="dim">PROJECTS</text>
  <text x="36" y="150">DEMOS</text>
  <text x="48" y="178">B-SIDES</text>
  <text x="36" y="206">LIVE SET</text>
  <path class="dim" d="M24 228h120"/>
  <text x="24" y="252" class="dim">SYNC</text>
  <text x="24" y="284" class="dim">STORAGE</text>
  <text x="24" y="316" class="dim">SETTINGS</text>
  <!-- master pane -->
  <path class="dim" d="M392 0v420"/>
  <text x="192" y="44">REHEARSAL 04</text>
  <path class="dim" d="M192 60h176"/>
  <rect x="176" y="72" width="216" height="40" class="accent"/>
  <text x="192" y="98" class="accent">TAKE 11</text>
  <path class="dim" d="M192 128h176"/>
  <text x="192" y="152">MIX NOTES</text>
  <path class="dim" d="M192 168h176"/>
  <text x="192" y="192">ROOM TONE</text>
  <path class="dim" d="M192 208h176"/>
  <text x="192" y="232">LIVE SET · SESSION</text>
  <path class="dim" d="M192 248h176"/>
  <!-- the record button, kept inside this pane -->
  <circle cx="284" cy="374" r="18" class="accent"/>
  <circle cx="284" cy="374" r="7" class="accent"/>
  <!-- detail pane: the player, in place -->
  <text x="416" y="44">TAKE 11</text>
  <path class="dim" d="M416 116h280"/>
  <path d="M420 100v32M430 88v56M440 106v20M450 82v68M460 98v36M470 92v48M480 108v16M490 84v64M500 100v32M510 94v44M520 104v24M530 86v60M540 98v36M550 90v52M560 106v20M570 96v40M580 102v28M590 88v56M600 100v32M610 94v44M620 104v24M630 90v52M640 98v36M650 102v28M660 92v48M670 100v32M680 96v40M690 104v24"/>
  <path class="accent" d="M556 74v84"/>
  <circle cx="440" cy="204" r="16"/>
  <path d="M435 197l12 7-12 7z"/>
  <path class="dim" d="M472 204h36M520 204h36"/>
  <text x="696" y="208" text-anchor="end">04:18</text>
  <path class="dim" d="M416 244h280"/>
  <text x="416" y="272" class="dim">WAV · 48 KHZ · STEREO</text>
  <text x="416" y="308">01:12 · SECOND CHORUS</text>
  <text x="416" y="336">02:40 · BRIDGE IS LONG</text>
</svg>
<figcaption>The iPad shell: navigation, the list, and the selected item's own pane.</figcaption>
</figure>

## Everything opens in place

The right pane is not a preview. It hosts the real player, the real note editor and the real session editor, the same ones the phone pushes full-screen. Recording happens there too, with the list still live next to it, while the record button stays inside the list column where it belongs. Settings, Storage and Details come up as sheets over the shell rather than pushing the library away.

In portrait the sidebar narrows to icons so the two panes still fit. Below 900 points, RECN uses the phone layout.

## Pointer and keyboard

Rows answer a right-click with a context menu and change the cursor under a pointer. With a keyboard: Command-N for a new note, Command-R to record, Command-F to search, arrows and Return to walk the list, Delete to remove, Space to play what is selected, Escape to back out.

The iPad also knows it is an iPad. It says so on the Sync screen, and it shows as a tablet on your other devices rather than as a phone.
