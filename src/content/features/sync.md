---
title: Device to device sync
summary: Your recordings copy themselves between your own devices, with no account and no server in the middle.
group: Sync
order: 1
platforms: [macOS, Windows, iPhone, iPad, Android]
shipped: 2026-09-18
---

You record at rehearsal on your phone and you want it on the Mac when you sit down to edit. No upload, no account.

Pair your devices once and they keep each other current on their own. On one network they find each other and sync with no internet at all. Apart, they connect directly when the networks between them allow it, and through an encrypted relay when they do not. Every device row says which of the three is happening: Local, Direct or Relayed.

<figure class="mock">
<svg viewBox="0 0 720 440" role="img" aria-label="Line drawing of the desktop Sync screen. A header holds a safety and structure toggle and a pair button, one status line sits under it, recording dots float between three device hubs in a field with a legend, and a file list on the right gives every recording a status dot and one cell per device.">
  <text x="24" y="35">SYNC</text>
  <rect x="404" y="18" width="164" height="26" class="dim"/>
  <path class="dim" d="M486 18v26"/>
  <text x="445" y="35" text-anchor="middle">SAFETY</text>
  <text x="527" y="35" text-anchor="middle">STRUCTURE</text>
  <rect x="584" y="18" width="116" height="26" class="dim"/>
  <path d="M596 31h10M601 26v10"/>
  <text x="654" y="35" text-anchor="middle">PAIR A DEVICE</text>
  <path class="dim" d="M0 60h720"/>
  <rect x="24" y="76" width="404" height="28" class="dim"/>
  <text x="38" y="95">3 ON SOME DEVICES ONLY</text>
  <path class="dim" d="M452 60v380"/>
  <rect x="60" y="150" width="44" height="44"/>
  <text x="82" y="210" text-anchor="middle">STUDIO MAC</text>
  <rect x="348" y="150" width="44" height="44"/>
  <text x="370" y="210" text-anchor="middle">TOUR IPHONE</text>
  <rect x="204" y="312" width="44" height="44"/>
  <text x="226" y="372" text-anchor="middle">KITCHEN IPAD</text>
  <path class="dim" d="M112 186l64 40M208 232l142-38M198 254l30 54M164 238l58 76"/>
  <circle cx="186" cy="230" r="8" class="safe"/>
  <circle cx="232" cy="200" r="6" class="safe"/>
  <circle cx="150" cy="264" r="7" class="safe"/>
  <circle cx="286" cy="246" r="9" class="single"/>
  <circle cx="258" cy="288" r="6" class="single"/>
  <circle cx="126" cy="214" r="5" class="safe"/>
  <circle cx="318" cy="296" r="7" class="single"/>
  <circle cx="206" cy="166" r="6" class="safe"/>
  <circle cx="40" cy="410" r="5" class="safe"/>
  <text x="52" y="414">BACKED UP</text>
  <circle cx="164" cy="410" r="5" class="single"/>
  <text x="176" y="414">ONE COPY</text>
  <text x="468" y="136">40 FILES · 3 DEVICES</text>
  <rect x="468" y="148" width="60" height="18" class="dim"/>
  <text x="498" y="161" text-anchor="middle">AT RISK</text>
  <rect x="536" y="148" width="60" height="18" class="dim"/>
  <text x="566" y="161" text-anchor="middle">NEWEST</text>
  <rect x="468" y="176" width="34" height="18" class="dim"/>
  <text x="485" y="189" text-anchor="middle">ALL</text>
  <rect x="510" y="176" width="66" height="18" class="dim"/>
  <text x="543" y="189" text-anchor="middle">ONLY HERE</text>
  <rect x="584" y="176" width="64" height="18" class="dim"/>
  <text x="616" y="189" text-anchor="middle">DAMAGED</text>
  <path class="dim" d="M452 206h268"/>
  <text x="468" y="228">ON EVERY DEVICE</text>
  <circle cx="472" cy="256" r="4" class="safe"/>
  <text x="484" y="259">REHEARSAL 04</text>
  <circle cx="640" cy="256" r="5" class="safe"/>
  <circle cx="662" cy="256" r="5" class="safe"/>
  <circle cx="684" cy="256" r="5" class="safe"/>
  <path class="dim" d="M452 276h268"/>
  <circle cx="472" cy="298" r="4" class="safe"/>
  <text x="484" y="301">SOUNDCHECK</text>
  <circle cx="640" cy="298" r="5" class="safe"/>
  <circle cx="662" cy="298" r="5" class="safe"/>
  <circle cx="684" cy="298" r="5" class="safe"/>
  <path class="dim" d="M452 318h268"/>
  <text x="468" y="346">ONLY ON THIS DEVICE</text>
  <circle cx="472" cy="374" r="4" class="single"/>
  <text x="484" y="377">TAKE 12</text>
  <circle cx="640" cy="374" r="5" class="safe"/>
  <circle cx="662" cy="374" r="5" class="dim"/>
  <circle cx="684" cy="374" r="5" class="dim"/>
  <path class="dim" d="M452 394h268"/>
  <circle cx="472" cy="416" r="4" class="single"/>
  <text x="484" y="419">VOICE NOTE 9</text>
  <circle cx="640" cy="416" r="5" class="safe"/>
  <circle cx="662" cy="416" r="5" class="dim"/>
  <circle cx="684" cy="416" r="5" class="dim"/>
</svg>
<figcaption>The Sync screen on a desktop: the field of recordings, and the file list beside it.</figcaption>
</figure>

## Where each recording lives

Sync leads with one line: is your work safe. Under it, every recording is listed by name with one cell per device, so you can see which machines hold the bytes. Green means every device you have paired has a copy. Amber means it falls short of that, usually because it exists once. Filter the list to what is not on this device and pull it down.

Audio moves in verified pieces that survive a dropped connection or a restart, so an interrupted transfer picks up where it stopped.

## How far it should go

Each device gets one choice, offered during setup and changeable later: **Only on my local network**, or **Anywhere**. Local keeps everything on your Wi-Fi and works with no internet. Anywhere lets your devices reach each other when they are apart.

[How the sync works](/recn-website/how-it-works/) explains what is underneath.
