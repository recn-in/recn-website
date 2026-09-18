---
title: Record without opening RECN
summary: RECN can sit in the menu bar or tray and record from a keyboard shortcut, with no window in the way.
group: Record
order: 2
platforms: [macOS, Windows]
shipped: 2026-09-17
---

The moment you want to record is rarely the moment you want to go find an app. You are in a call, in a rehearsal, mid-sentence. Switching windows is how the thought gets lost.

Turn on **Keep RECN running in the background** and RECN stays alive after you close its windows, as an item in the macOS menu bar or the Windows tray.

<figure class="mock">
<svg viewBox="0 0 720 360" role="img" aria-label="Line drawing of a desktop with no RECN window open. The menu bar at the top holds a small RECN item whose menu is open, listing Open RECN, Stop recording, Settings and Quit RECN, with the recording entry marked. Below, two keycap rows show the Control Option Space and Control Option R shortcuts.">
  <!-- desktop with no app window -->
  <rect x="0.5" y="0.5" width="719" height="359" class="dim"/>
  <path class="dim" d="M0 40h720"/>
  <!-- status item -->
  <circle cx="540" cy="20" r="7" class="accent"/>
  <path class="dim" d="M572 12h10M572 20h10M572 28h10"/>
  <path class="dim" d="M604 12h10M604 20h10M604 28h10"/>
  <path class="dim" d="M636 12h10M636 20h10M636 28h10"/>
  <text x="690" y="24" text-anchor="middle">12:04</text>
  <!-- the open menu -->
  <rect x="452" y="52" width="176" height="124"/>
  <path d="M536 44l8 8h-16z"/>
  <text x="472" y="76">OPEN RECN</text>
  <circle cx="462" cy="102" r="5" class="accent"/>
  <text x="472" y="106" class="accent">STOP RECORDING</text>
  <path class="dim" d="M452 118h176"/>
  <text x="472" y="140">SETTINGS…</text>
  <text x="472" y="164">QUIT RECN</text>
  <!-- the two global hotkeys -->
  <text x="88" y="238">SHOW RECN</text>
  <rect x="88" y="252" width="34" height="28"/><text x="105" y="270" text-anchor="middle">CTRL</text>
  <rect x="130" y="252" width="34" height="28"/><text x="147" y="270" text-anchor="middle">ALT</text>
  <rect x="172" y="252" width="66" height="28"/><text x="205" y="270" text-anchor="middle">SPACE</text>
  <text x="330" y="238">START OR STOP RECORDING</text>
  <rect x="330" y="252" width="34" height="28" class="accent"/><text x="347" y="270" text-anchor="middle">CTRL</text>
  <rect x="372" y="252" width="34" height="28" class="accent"/><text x="389" y="270" text-anchor="middle">ALT</text>
  <rect x="414" y="252" width="34" height="28" class="accent"/><text x="431" y="270" text-anchor="middle">R</text>
  <path class="dim dash" d="M88 312h544"/>
  <text x="88" y="334" class="dim">NO WINDOW OPEN</text>
</svg>
<figcaption>The menu bar item and its menu, with no RECN window open.</figcaption>
</figure>

## Two shortcuts, anywhere

Control-Option-Space brings RECN forward. Control-Option-R starts a recording, and pressing it again stops one. They work from inside any other app. If the operating system has already given a shortcut to something else, Settings says so instead of pretending it is bound.

The same start and stop is in the menu itself, next to Open RECN, Settings and Quit. A take started this way has no window and no review step: it goes straight into your library, named, where you would find any other recording. The menu-bar item shows when a recording is running, wherever it was started from.

## Opening itself

**Open at login** starts RECN in the background when you sign in, so the shortcut is live before you think to press it. Both settings are off until you turn them on, and quitting from the menu really quits.
