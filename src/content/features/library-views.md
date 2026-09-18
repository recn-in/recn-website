---
title: Library views
summary: Feed, Table, Gallery, Columns and Calendar. Five ways to read the same library on the desktop.
group: Find
order: 4
platforms: [macOS, Windows]
shipped: 2026-09-18
---

The same library answers different questions badly in the same layout. What have I been doing lately is a list. Which of these is stereo is a table. Which drawing was that is a wall of pictures. What happened in March is a calendar. So the desktop library can be read five ways, and the rows underneath never change.

<figure class="mock">
<svg viewBox="0 0 720 440" role="img" aria-label="Line drawing of five small panels showing the desktop library's five views: a feed of rows with waveform marks, a table of columns, a grid of gallery tiles, three navigator columns with one row selected, and a month calendar with a ring around today. A sixth panel shows the view options popover with its Group by and Show sections.">
  <text x="32" y="68">FEED</text>
  <rect x="32" y="76" width="208" height="150" class="dim"/>
  <path class="dim" d="M44 98v16M50 94v24M56 100v12M62 96v20M44 144v16M50 140v24M56 146v12M62 142v20M44 190v16M50 186v24M56 192v12M62 188v20"/>
  <path d="M76 102h96M76 148h84M76 194h104"/>
  <path class="dim" d="M76 114h72M76 160h60M76 206h80"/>
  <text x="256" y="68">TABLE</text>
  <rect x="256" y="76" width="208" height="150" class="dim"/>
  <path class="dim" d="M256 106h208"/>
  <path class="dim" d="M326 90v128M386 90v128M426 90v128"/>
  <path class="dim" d="M268 98h40M336 98h32M396 98h20M436 98h18"/>
  <path d="M268 124h44M336 124h30M396 124h22M436 124h16M268 148h38M336 148h34M396 148h18M436 148h20M268 172h46M336 172h28M396 172h24M436 172h14M268 196h34M336 196h32M396 196h20M436 196h18"/>
  <text x="480" y="68">GALLERY</text>
  <rect x="480" y="76" width="208" height="150" class="dim"/>
  <rect x="492" y="96" width="56" height="56" class="dim"/>
  <rect x="556" y="96" width="56" height="56" class="dim"/>
  <rect x="620" y="96" width="56" height="56" class="dim"/>
  <rect x="492" y="160" width="56" height="56" class="dim"/>
  <rect x="556" y="160" width="56" height="56" class="dim"/>
  <rect x="620" y="160" width="56" height="56" class="dim"/>
  <path d="M504 118v12M510 114v20M516 120v8M522 116v16M528 122v4"/>
  <path d="M570 112h28M570 122h28M570 132h18"/>
  <path d="M632 132l12-12 8 8 10-10"/>
  <path d="M504 182v12M510 178v20M516 184v8M522 180v16M528 186v4"/>
  <path d="M570 176h28M570 186h28M570 196h18"/>
  <rect x="636" y="178" width="24" height="20" class="dim"/>
  <text x="32" y="246">COLUMNS</text>
  <rect x="32" y="254" width="208" height="150" class="dim"/>
  <path class="dim" d="M102 268v126M172 268v126"/>
  <path d="M44 292h46M44 312h46M44 332h46M44 352h46M114 292h46M114 312h46M114 332h46M184 292h44M184 312h44"/>
  <rect x="38" y="304" width="58" height="18" class="accent"/>
  <text x="256" y="246">CALENDAR</text>
  <rect x="256" y="254" width="208" height="150" class="dim"/>
  <text x="268" y="278">SEPTEMBER</text>
  <path class="dim" d="M264 286v112M292 286v112M320 286v112M348 286v112M376 286v112M404 286v112M432 286v112M460 286v112"/>
  <path class="dim" d="M264 286h196M264 314h196M264 342h196M264 370h196M264 398h196"/>
  <circle cx="334" cy="328" r="9" class="accent"/>
  <path d="M276 300h6M360 300h6M304 356h6M416 384h6"/>
  <text x="480" y="246">VIEW OPTIONS</text>
  <rect x="480" y="254" width="208" height="150" class="dim"/>
  <text x="492" y="280">GROUP BY</text>
  <path d="M492 292l4 4 7-8"/>
  <path d="M514 294h58M514 314h70"/>
  <path class="dim" d="M480 330h208"/>
  <text x="492" y="352">SHOW</text>
  <rect x="492" y="362" width="11" height="11" class="dim"/>
  <rect x="492" y="382" width="11" height="11" class="dim"/>
  <path d="M514 368h58M514 388h44"/>
</svg>
<figcaption>The five Library views, and the view options popover.</figcaption>
</figure>

## The five

Feed is rows in one running order, the default. Table is sortable columns you choose: name, kind, project, duration, format, size, device, date. Gallery draws each item as a tile, so a waveform, a note and a drawing are told apart by looking. Columns walks the project tree one column at a time. Calendar lays a month or a year out by day and lists the selected day beneath. Command-1 through Command-5 switches between them, and each window remembers the one it was left in.

## One set of options

Command-J opens the options for whichever view you are in. Group by time, kind, project, device, place or tag. Turn Stacks on and any group of two or more folds into one row you open in place. Show decides which kinds appear at all. The feed has three row densities; the table has its column list.

A view is only offered the options it can act on. A calendar has nowhere to put a group, so the group control is not there, and sorting belongs to the Table alone.

These five are a desktop thing. The phone keeps its single feed.
