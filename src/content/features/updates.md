---
title: Staying up to date
summary: The desktop app updates itself, and your phone tells you when a new build is out and what changed in it.
group: Everywhere
order: 3
platforms: [macOS, Windows, iPhone, iPad, Android]
shipped: 2026-07-15
---

RECN is in beta, which means it changes every week. You should not have to go looking for that, and you should certainly never lose a recording to an update that arrived at the wrong moment.

<figure class="mock">
<svg viewBox="0 0 720 360" role="img" aria-label="Line drawing of two update surfaces. On the left, the desktop Updates settings pane with a version row, a channel row set to Beta, an automatic-download toggle, a progress ring showing a download and a Check for updates button. On the right, a phone screen whose library feed carries an update row at the top reading A new build is ready with an UPDATE action.">
  <!-- desktop settings pane -->
  <rect x="40.5" y="40.5" width="360" height="280" class="dim"/>
  <text x="62" y="78">VERSION</text>
  <text x="378" y="78" text-anchor="end" class="dim">1.0.2 (41)</text>
  <path class="dim" d="M62 96h316"/>
  <text x="62" y="126">CHANNEL</text>
  <rect x="290" y="110" width="88" height="22" class="dim"/>
  <text x="334" y="126" text-anchor="middle">BETA</text>
  <path class="dim" d="M62 148h316"/>
  <text x="62" y="178">DOWNLOAD AUTOMATICALLY</text>
  <rect x="340" y="164" width="38" height="20"/>
  <circle cx="368" cy="174" r="7" class="accent"/>
  <path class="dim" d="M62 200h316"/>
  <circle cx="82" cy="240" r="16" class="dim"/>
  <path class="accent" d="M82 224a16 16 0 0 1 12 26"/>
  <text x="112" y="236">DOWNLOADING 1.0.3</text>
  <text x="112" y="256" class="dim">64%  ·  2.1 MB/S</text>
  <rect x="62" y="278" width="136" height="24"/>
  <text x="130" y="294" text-anchor="middle">CHECK FOR UPDATES</text>
  <!-- phone -->
  <rect x="460.5" y="20.5" width="210" height="320" class="dim"/>
  <text x="478" y="52" class="dim">LIBRARY</text>
  <!-- the update row, pinned above the feed -->
  <path class="dim" d="M478 66h174"/>
  <path class="accent" d="M492 82v18M486 94l6 6 6-6"/>
  <text x="512" y="92">A NEW BUILD IS READY</text>
  <text x="512" y="110" class="dim">LOOPS CROSSFADE NOW</text>
  <text x="652" y="100" text-anchor="end" class="accent">UPDATE</text>
  <path class="dim" d="M478 124h174"/>
  <!-- the ordinary feed underneath -->
  <text x="478" y="154">REHEARSAL 04</text>
  <path class="dim" d="M478 168h174"/>
  <text x="478" y="198">TAKE 11</text>
  <path class="dim" d="M478 212h174"/>
  <text x="478" y="242">MIX NOTES</text>
  <path class="dim" d="M478 256h174"/>
  <text x="478" y="286">ROOM TONE</text>
  <path class="dim" d="M478 300h174"/>
</svg>
<figcaption>Desktop update settings, and the update row on a phone.</figcaption>
</figure>

## On a Mac or a PC

The installed app checks for itself once a day and downloads the next build quietly in the background. It installs when you relaunch, so nothing interrupts a recording in progress. You can watch the download in Settings, with the percentage and the speed, and install it there the moment it is ready.

There are two channels. **Beta** is the one to be on. **Beta Nightly** ships straight from the current code and will sometimes be broken.

## On a phone or tablet

RECN checks for a newer build at every launch and every time you come back to it, and puts a row at the top of your library when there is one. The row carries the release notes for that build, written as what changed for you, so you can decide whether it is worth the interruption.

Tapping it hands off to the store. On Android the new build downloads while you keep working and the row turns into a restart. On iPhone and iPad it opens TestFlight. Dismissing the row hides it until the next launch.
