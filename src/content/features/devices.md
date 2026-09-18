---
title: Your devices
summary: Pair in a tap on the same network or with a code from anywhere, then see the honest state of every device on the list.
group: Sync
order: 2
platforms: [macOS, Windows, iPhone, iPad, Android]
shipped: 2026-09-18
---

Sync is only as trustworthy as the list of machines doing it. RECN shows you that list plainly.

Pairing takes a confirmation on both sides. On one network you tap a device you can see, and the person at that device accepts or denies. When the two are not on one network, one shows a QR code with the same string as text underneath. A phone or iPad scans it with its camera; a Mac or PC pastes it. The code lasts five minutes and is spent once.

<figure class="mock">
<svg viewBox="0 0 720 420" role="img" aria-label="Line drawing of two RECN surfaces side by side. On the left a phone shows the Devices tab: a pair row, then three device rows with name, owner and system, a status line, how many recordings each holds, and a try now button. On the right is the off-network panel of the desktop pair dialog with a QR code, copy and hide buttons, a paste field and a pair button.">
  <rect x="32" y="16" width="336" height="388" class="dim"/>
  <text x="46" y="44">SYNC</text>
  <path class="dim" d="M32 56h336"/>
  <rect x="44" y="68" width="312" height="26" class="accent"/>
  <path class="accent" d="M56 81h10M61 76v10"/>
  <text x="80" y="85">PAIR A DEVICE</text>
  <rect x="44" y="104" width="312" height="72" class="dim"/>
  <rect x="56" y="118" width="20" height="14"/>
  <path d="M52 136h28"/>
  <text x="90" y="126">STUDIO MAC</text>
  <text x="258" y="126">MANAGES SYNC</text>
  <text x="90" y="144">SHUBHAM · MACOS 15.2</text>
  <text x="90" y="162">CONNECTED · LOCAL</text>
  <text x="272" y="162">40 OF 40</text>
  <rect x="44" y="186" width="312" height="94" class="dim"/>
  <rect x="58" y="198" width="14" height="22"/>
  <text x="90" y="208">TOUR IPHONE</text>
  <text x="90" y="226">SHUBHAM · IOS 18.2</text>
  <text x="90" y="244">PAIRED · NOT CONNECTED</text>
  <text x="272" y="244">31 OF 40</text>
  <rect x="90" y="252" width="80" height="20" class="accent"/>
  <text x="130" y="265" text-anchor="middle">TRY NOW</text>
  <rect x="44" y="290" width="312" height="72" class="dim"/>
  <rect x="56" y="302" width="18" height="24"/>
  <text x="90" y="312">KITCHEN IPAD</text>
  <text x="90" y="330">SHUBHAM · IPADOS 18.2</text>
  <text x="90" y="348">PAIRED · DORMANT</text>
  <text x="272" y="348">40 OF 40</text>
  <text x="44" y="386">WHERE SHOULD RECN SYNC?</text>
  <rect x="400" y="52" width="288" height="316" class="dim"/>
  <text x="418" y="82">NOT ON THIS NETWORK?</text>
  <rect x="482" y="98" width="124" height="124"/>
  <rect x="492" y="108" width="26" height="26"/>
  <rect x="499" y="115" width="12" height="12"/>
  <rect x="570" y="108" width="26" height="26"/>
  <rect x="577" y="115" width="12" height="12"/>
  <rect x="492" y="186" width="26" height="26"/>
  <rect x="499" y="193" width="12" height="12"/>
  <rect x="532" y="112" width="9" height="9" class="dim"/>
  <rect x="546" y="126" width="9" height="9" class="dim"/>
  <rect x="532" y="140" width="9" height="9" class="dim"/>
  <rect x="560" y="154" width="9" height="9" class="dim"/>
  <rect x="532" y="168" width="9" height="9" class="dim"/>
  <rect x="574" y="182" width="9" height="9" class="dim"/>
  <rect x="546" y="196" width="9" height="9" class="dim"/>
  <rect x="560" y="182" width="9" height="9" class="dim"/>
  <text x="418" y="244">SCAN THIS. THE CODE LASTS 5 MINUTES.</text>
  <rect x="418" y="258" width="84" height="22" class="dim"/>
  <text x="460" y="272" text-anchor="middle">COPY CODE</text>
  <rect x="512" y="258" width="52" height="22" class="dim"/>
  <text x="538" y="272" text-anchor="middle">HIDE</text>
  <rect x="418" y="296" width="252" height="24" class="dim dash"/>
  <text x="428" y="312">OR PASTE A CODE</text>
  <rect x="418" y="332" width="60" height="22" class="accent"/>
  <text x="448" y="346" text-anchor="middle">PAIR</text>
</svg>
<figcaption>The Devices tab on a phone, and the off-network panel of the desktop pair dialog.</figcaption>
</figure>

## Rows that tell the truth

A row names the device, its owner, its system and its model, and carries one status line: Connected, Connecting, Paired and dormant, Paused, or Paired and not connected. When something is wrong the row says so and offers the single action worth taking. It also says how many of your recordings sit on that device.

## Removing one, keeping the rest

Taking a device out of sync removes it everywhere, not just here. The confirmation names the devices that stay connected and warns you when something lives only on the one you are removing. Recordings already on it stay on it. A desktop can do this; a phone points you at the desktop that manages the sync.

Pair a phone again after reinstalling and the other device recognises it and offers to remove the stale entry. Keeping both is the default.

Reset RECN, in Settings under Developer, takes this device out of sync and starts it over, with a switch that keeps your library.
