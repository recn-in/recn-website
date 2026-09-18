---
title: Private by default
summary: No account and no hosted library. Your recordings live on your devices, and crash reports have an off switch.
group: Private
order: 1
platforms: [macOS, Windows, iPhone, iPad, Android]
shipped: 2026-07-15
---

Half-finished songs, rehearsals, a voice memo of an argument about a chorus. None of that is material anyone wants sitting on a company's servers by default, so RECN does not put it there.

Recordings, notes, projects, sessions and their audio stay on the device that made them and on the devices you pair with it. There is no RECN account to create and no hosted library to sign into.

<figure class="mock">
<svg viewBox="0 0 720 400" role="img" aria-label="Line drawing of the desktop Settings window. A rail on the left lists the panes under Workspace, Devices and System with Privacy selected, and the pane on the right holds the share crash reports switch and a list of permissions with their states.">
  <text x="24" y="35">SETTINGS</text>
  <rect x="448" y="18" width="220" height="26" class="dim"/>
  <circle cx="464" cy="31" r="5"/>
  <path d="M468 35l5 5"/>
  <text x="480" y="35">FIND A SETTING</text>
  <path d="M686 24l14 14M700 24l-14 14"/>
  <path class="dim" d="M0 60h720"/>
  <path class="dim" d="M204 60v340"/>
  <text x="20" y="88">WORKSPACE</text>
  <text x="20" y="112">LIBRARY</text>
  <text x="20" y="134">AUDIO</text>
  <text x="20" y="156">MODELS</text>
  <text x="20" y="178">APPEARANCE</text>
  <text x="20" y="212">DEVICES</text>
  <text x="20" y="236">SYNC</text>
  <rect x="8" y="246" width="188" height="22" class="accent"/>
  <text x="20" y="262">PRIVACY</text>
  <text x="20" y="296">SYSTEM</text>
  <text x="20" y="320">UPDATES</text>
  <text x="20" y="342">ABOUT</text>
  <text x="236" y="102">SHARE CRASH REPORTS</text>
  <text x="236" y="122">CRASH AND ERROR REPORTS HELP FIX BUGS.</text>
  <text x="236" y="138">NEVER INCLUDES RECORDINGS OR NOTES.</text>
  <rect x="616" y="94" width="44" height="22" rx="11" class="accent"/>
  <circle cx="649" cy="105" r="7" class="accent"/>
  <text x="236" y="188">PERMISSIONS</text>
  <path class="dim" d="M236 200h448"/>
  <text x="236" y="224">MICROPHONE</text>
  <text x="560" y="224">GRANTED</text>
  <path class="dim" d="M236 240h448"/>
  <text x="236" y="264">LOCAL NETWORK</text>
  <text x="560" y="264">GRANTED</text>
  <path class="dim" d="M236 280h448"/>
  <text x="236" y="304">NOTIFICATIONS</text>
  <text x="560" y="304">NOT REQUESTED</text>
  <rect x="236" y="316" width="46" height="20" class="dim"/>
  <text x="259" y="330" text-anchor="middle">ASK</text>
  <path class="dim" d="M236 348h448"/>
  <text x="236" y="372">CAMERA</text>
  <text x="560" y="372">DENIED</text>
  <rect x="300" y="360" width="104" height="20" class="dim"/>
  <text x="352" y="374" text-anchor="middle">OPEN SETTINGS</text>
</svg>
<figcaption>Settings, Privacy: the crash-report switch and what RECN may reach.</figcaption>
</figure>

## Listening happens on the device

Transcription runs on the phone or tablet itself, not on a server. The transcript then syncs to your other devices like any other text, which is how it reaches a Mac or PC. Fetching a transcription model is an ordinary download from Hugging Face, and your audio does not go with it.

## What can leave, and how to stop it

Release builds send crash and error reports so bugs can be found and fixed. They are on by default and one switch turns them off: Settings, then Privacy, then Share crash reports. A report carries app and system versions, device details, stack traces and recent technical logs. Recordings, notes and photos are not attached to it.

When two of your devices cannot reach each other directly, their traffic passes through a public relay. A relay forwards packets it cannot read, and it is not a copy of your library. If you would rather nothing left the building, set sync to **Only on my local network** and the relays go off.

The [privacy policy](/recn-website/privacy/) is the long version.
