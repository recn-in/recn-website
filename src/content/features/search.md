---
title: Search
summary: One field that looks through names, note text, transcripts and project names, and stays quick on a large library.
group: Find
order: 2
platforms: [macOS, Windows, iPhone, iPad, Android]
shipped: 2026-07-12
---

After a year of recording, the name you gave a take is often the only clue you have left, and sometimes not even that. Search is how a library stops being a pile.

<figure class="mock">
<svg viewBox="0 0 720 360" role="img" aria-label="Line drawing of the desktop Library header with a search field holding a query, and the results beneath it. Each result is a small kind mark, a title, and a line of matched text with the matched words picked out. The kind of each result is named at the right.">
  <text x="40" y="49">LIBRARY</text>
  <rect x="200" y="28" width="280" height="32" class="dim"/>
  <circle cx="218" cy="42" r="6"/>
  <path d="M223 47l6 6"/>
  <path d="M240 44h86"/>
  <rect x="520" y="28" width="66" height="32" class="dim"/>
  <circle cx="542" cy="44" r="5" class="accent"/>
  <rect x="602" y="28" width="78" height="32" class="dim"/>
  <path d="M618 44h12M624 38v12"/>
  <path class="dim" d="M20 80h680"/>
  <rect x="44" y="104" width="14" height="14" class="dim"/>
  <path d="M72 116h214"/>
  <path class="dim" d="M72 130h248"/>
  <path class="accent" d="M180 130h44"/>
  <text x="676" y="120" text-anchor="end">TAKE</text>
  <rect x="44" y="152" width="14" height="14" class="dim"/>
  <path d="M72 164h166"/>
  <path class="dim" d="M72 178h286"/>
  <path class="accent" d="M118 178h44"/>
  <text x="676" y="168" text-anchor="end">NOTE</text>
  <rect x="44" y="200" width="14" height="14" class="dim"/>
  <path d="M72 212h242"/>
  <path class="dim" d="M72 226h202"/>
  <text x="676" y="216" text-anchor="end">SESSION</text>
  <rect x="44" y="248" width="14" height="14" class="dim"/>
  <path d="M72 260h188"/>
  <path class="dim" d="M72 274h264"/>
  <path class="accent" d="M232 274h44"/>
  <text x="676" y="264" text-anchor="end">DRAWING</text>
  <rect x="44" y="296" width="14" height="14" class="dim"/>
  <path d="M72 308h156"/>
  <path class="dim" d="M72 322h180"/>
  <text x="676" y="312" text-anchor="end">PROJECT</text>
</svg>
<figcaption>Searching the Library on the desktop.</figcaption>
</figure>

## On a Mac or PC

Press Command-F, or Control-F on Windows, and type into the field in the Library header. It looks at names, the text of your notes, transcripts and project names, and it returns recordings, notes, sessions, projects and drawings together. A match in a name outranks a match buried in a transcript, and a search started at the Library still reaches into projects.

Up to about fifteen hundred items the list filters as you type. Past that the same query goes to an index that runs off the main thread, so a very large library types just as smoothly. Names are matched by fragment too, so a half-remembered or slightly mistyped one still finds its take.

## On a phone or iPad

Search covers recordings, notes and sessions, matching on name, project, tags from analysis and the transcript. Filters narrow the list to one kind, or to transcript matches alone. A transcript hit shows the sentence that matched and the time it was said.
