---
title: Recording
summary: Press record and the audio goes straight to a file, with a meter and a live waveform while it runs.
group: Record
order: 1
platforms: [macOS, Windows, iPhone, iPad, Android]
shipped: 2026-07-15
---

An idea arrives and the only thing that matters is catching it. Press record first; naming, filing and listening back all come after.

Audio is written into the file as it is captured, on every platform. Nothing is held in memory waiting for you to stop, so a take runs as long as the free space does.

<figure class="mock">
<svg viewBox="0 0 720 420" role="img" aria-label="Line drawing of two RECN recording surfaces side by side. On the left a phone screen with an INPUT label, a level meter beside a live waveform, a timer, a record button and the current input written underneath. On the right a desktop window whose library list stays visible above a recorder strip holding the record button, the meter, the waveform, the input chip and the elapsed clock.">
  <!-- phone -->
  <rect x="40.5" y="40.5" width="210" height="350" class="dim"/>
  <text x="58" y="78">INPUT</text>
  <circle cx="106" cy="74" r="5" class="dim"/>
  <!-- level meter: two channels -->
  <rect x="58" y="96" width="6" height="80" class="dim"/>
  <rect x="68" y="96" width="6" height="80" class="dim"/>
  <path d="M58 132v44M68 140v36"/>
  <!-- live waveform -->
  <path class="dim" d="M86 136h148"/>
  <path d="M90 124v24M98 116v40M106 130v16M114 108v56M122 122v28M130 112v48M138 128v20M146 104v64M154 120v32M162 114v44"/>
  <path class="accent" d="M170 110v52M178 126v20M186 106v60M194 122v28M202 116v40M210 128v16M218 112v48M226 124v24"/>
  <text x="145" y="296" text-anchor="middle">00:12</text>
  <circle cx="145" cy="332" r="20" class="accent"/>
  <circle cx="145" cy="332" r="8" class="accent"/>
  <text x="145" y="374" text-anchor="middle">BUILT-IN · STEREO</text>
  <!-- desktop window -->
  <rect x="290.5" y="40.5" width="390" height="350" class="dim"/>
  <path class="dim" d="M290 78h390"/>
  <text x="306" y="66">LIBRARY</text>
  <rect x="430" y="52" width="140" height="18" class="dim"/>
  <rect x="586" y="52" width="80" height="18"/>
  <text x="626" y="65" text-anchor="middle">RECORD</text>
  <!-- library rows, still visible behind the recorder -->
  <path class="dim" d="M306 130h348M306 174h348M306 218h348M306 262h348"/>
  <text x="306" y="122">REHEARSAL 04</text>
  <text x="306" y="166">TAKE 11</text>
  <text x="306" y="210">ROOM TONE</text>
  <!-- recorder strip -->
  <rect x="300" y="282" width="370" height="76"/>
  <circle cx="326" cy="320" r="13" class="accent"/>
  <rect x="350" y="298" width="5" height="44" class="dim"/>
  <rect x="359" y="298" width="5" height="44" class="dim"/>
  <path d="M350 322v20M359 328v14"/>
  <path class="dim" d="M376 320h176"/>
  <path d="M380 310v20M388 302v36M396 314v12M404 298v44M412 308v24M420 304v32M428 316v8M436 300v40"/>
  <path class="accent" d="M444 306v28M452 312v16M460 302v36M468 314v12M476 308v24M484 300v40M492 316v8M500 306v28M508 310v20M516 304v32M524 314v12M532 308v24"/>
  <rect x="562" y="310" width="62" height="20" class="dim"/>
  <text x="593" y="324" text-anchor="middle">BUILT-IN</text>
  <text x="650" y="314" text-anchor="middle" class="accent">REC</text>
  <text x="650" y="338" text-anchor="middle">00:12.4</text>
</svg>
<figcaption>Recording on a phone, and the recorder strip inside the desktop window.</figcaption>
</figure>

## While it runs

A level meter sits beside a waveform that draws itself as you play. On a phone the timer and one button are the whole screen. On a computer the recorder is a strip inside the window, leaving the library visible. Stop puts you in review: play the take back, correct the name it suggested, then keep it or discard it.

## Choosing the input

Pick the microphone or interface from a picker on either device. An interface with more than one input also asks which one: a single input, a stereo pair, or every input summed to mono. Android cannot sum inputs, so that choice is not offered there. Your pick is remembered, and a recording carries the channel count that was actually written.

## Click and count-in

A multitrack session has a metronome with tap tempo and a one-bar count-in, on the desktop and on the phone. A single take has neither.

## Audio you already have

On a computer, drop files onto the window or choose them. On a phone, RECN can scan for audio already there: WhatsApp, the phone's own recorder, Downloads, your music folder. Files stay where they are until you pick the ones to bring in.
