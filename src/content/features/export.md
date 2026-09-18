---
title: Saving and exporting
summary: Hand the whole session over as one file, or render it to WAV or AAC.
group: Sessions
order: 5
platforms: [macOS, Windows, iPhone, iPad, Android]
shipped: 2026-09-08
---

At some point the work has to leave. A producer wants stems. A bandmate wants a rough mix on their phone. You want a copy that is not tied to this library.

<figure class="mock">
<svg viewBox="0 0 720 360" role="img" aria-label="Line drawing of the RECN export dialog standing over a session timeline. It has rows for what to render and in which format, a destination, a switch for exporting part of the timeline, and a list of the exact file names the run will write before a Close and an Export button.">
  <rect x="10.5" y="10.5" width="699" height="339" class="dim"/>
  <path class="dim" d="M10.5 46h699M180 46v303M180 62h530M180 92h530M10.5 160h699M10.5 228h699M10.5 296h699"/>
  <text x="24" y="33">REHEARSAL 04</text>
  <path class="dim" d="M190 80v10M232 84v6M274 80v10M316 84v6M358 80v10M400 84v6M442 80v10M484 84v6M526 80v10M568 84v6M610 80v10M652 84v6M694 80v10"/>
  <rect x="24" y="102" width="9" height="46" class="dim"/><text x="42" y="114">GUITAR</text>
  <rect x="24" y="170" width="9" height="46" class="dim"/><text x="42" y="182">VOX</text>
  <rect x="24" y="238" width="9" height="46" class="dim"/><text x="42" y="250">BASS</text>
  <rect x="190" y="100" width="336" height="52" class="dim"/>
  <rect x="274" y="168" width="336" height="52" class="dim"/>
  <rect x="358" y="236" width="336" height="52" class="dim"/>
  <rect x="170" y="58" width="380" height="278"/>
  <text x="188" y="82">EXPORT · REHEARSAL 04</text>
  <path class="dim" d="M170 94h380"/>
  <text x="188" y="118">WHAT</text>
  <rect x="330" y="106" width="200" height="18"/><text x="342" y="119">MIXDOWN AND STEMS</text>
  <path d="M516 113l4 4 4-4"/>
  <path class="dim" d="M188 132h342"/>
  <text x="188" y="156">FORMAT</text>
  <rect x="330" y="144" width="200" height="18"/><text x="342" y="157">WAV 24-BIT</text>
  <path d="M516 151l4 4 4-4"/>
  <path class="dim" d="M188 170h342"/>
  <text x="188" y="194">DESTINATION</text>
  <rect x="452" y="182" width="78" height="18"/><text x="491" y="195" text-anchor="middle">CHOOSE</text>
  <path class="dim" d="M188 208h342"/>
  <text x="188" y="230">EXPORT PART OF THE TIMELINE</text>
  <rect x="498" y="218" width="32" height="16" rx="8"/><circle cx="506" cy="226" r="5"/>
  <path class="dim" d="M170 246h380"/>
  <text x="188" y="264">WILL WRITE</text>
  <text x="188" y="282">REHEARSAL 04 — MIXDOWN.WAV</text>
  <text x="188" y="296">REHEARSAL 04 — GUITAR.WAV</text>
  <text x="188" y="310">REHEARSAL 04 — VOX.WAV</text>
  <rect x="386" y="306" width="62" height="20"/><text x="417" y="320" text-anchor="middle">CLOSE</text>
  <rect x="458" y="306" width="72" height="20" class="accent"/><text x="494" y="320" text-anchor="middle">EXPORT</text>
</svg>
<figcaption>The export dialog, listing the files it is about to write.</figcaption>
</figure>

## The session as one file

Save a Copy writes the arrangement and all of its audio as a single `.recn`. On a computer you choose where it lands; on a phone it goes to the share sheet. Open one on a device that already has that session and it takes you to the live session instead of making a second copy of it. Anywhere else it imports.

If a piece of audio is missing, RECN names the files it could not find and lets you point at the folder they live in. Each one is checked against what the session expects before it is attached to anything.

## Rendering audio

An export writes a mixdown, one file per track, or both, in WAV 16-bit, WAV 24-bit, AAC at 256 kbps or AAC at 128 kbps. Before you commit, the dialog lists the exact file names the run will write.

On a computer you pick the folder, and you can render just part of the timeline. On a phone the mixdown can join your library and this session's project directly.

Muted tracks and muted clips are honoured. Solo is not: it is a monitoring state the session never stores, so an export renders the mix you actually saved.
