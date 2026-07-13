---
title: "How LAN sync works"
date: 2026-07-12
category: research
excerpt: "How RECN exchanges library changes and audio between nearby devices."
---

This describes the sync architecture in the working build as of July 12, 2026.

RECN has two awkward requirements: it should work without waiting for a server, and it has to move recordings that are much larger than the notes around them.

Lattice is the layer built for that.

## The shape of the stack

The apps work with familiar types: recordings, notes, projects, annotations, transcripts, and sessions. Type descriptors turn those models into generic Lattice entities.

```text
RECN UI and services
        ↓
RECN type descriptors
        ↓
LatticeStore
  ├── SQLite: entities, clocks, vectors, outbox, blob metadata
  └── Filesystem: audio, images, and analysis bytes

mDNS → SyncEngine → one PeerConnectionManager per device → TCP
```

The Lattice runtime does not know what a recording is. It knows fields, clocks, entities, peers, and attached blobs. That separation lets the same merge and transport rules serve every kind of work RECN adds.

## One idea, two payloads

Small structured facts and large media behave differently, so Lattice does not force them through one representation.

An entity carries fields such as a recording name, project ID, duration, or update time. Each field carries merge metadata.

A blob has metadata describing its identity, size, format, hash, and known replicas. The bytes themselves live outside the entity store.

This matters for audio. A tiny title edit can converge without resending a 600 MB rehearsal. When the recording does need to travel, it can move in chunks and resume after a disconnect.

Filesystem paths are deliberately absent from the wire. `/Users/me/…` is true only on one computer. Every device resolves its own local copy.

## Discovery and approval

RECN advertises a local service through mDNS. A nearby app can see that a RECN device exists and where it is listening.

Pairing is a separate, user-confirmed TCP exchange. Once accepted, the device identity is persisted and the sync engine will reconnect when that peer becomes reachable again.

This is practical trust, not cryptographic identity. The current fingerprint helps recognise a reinstall; it is not proof backed by a private key. Account-backed, offline-verifiable device trust belongs to the next architecture and should not be confused with what ships today.

## One state machine per peer

Every paired device gets its own connection manager:

```text
idle → discovering → connecting → handshaking → catchingUp → live
                                              ↘ backingOff
```

The handshake negotiates protocol compatibility and confirms which device is on the other end. Catch-up compares what each side has already seen. Live mode then forwards new local writes.

Connections use heartbeats and a watchdog. Failed peers back off exponentially, from a short retry to a one-minute ceiling, instead of spinning against a missing machine.

## Catch-up without overwriting

Entity fields use a last-writer-wins register driven by a hybrid logical clock: physical time, a logical counter, and a device ID tie-break.

Two consequences matter:

- If one device renames a recording while another changes its project, both field edits survive.
- If both rename the same recording, the later clock wins deterministically.

Deletion is represented by a tombstone rather than immediately forgetting that an entity existed. That gives other replicas something concrete to merge.

This is convergence, not Google-Docs-style collaboration. A note body is still one merged field on `main`; per-block and character-level collaboration are later work.

## Moving the recording

When blob metadata arrives and the local file is missing, RECN can queue a fetch from a peer that advertises a copy.

The current transfer path is:

```text
request → offer → chunk window → acknowledgement → next window
                                            ↓
                                  resume from known offset
                                            ↓
                                length guard + SHA-256
```

Chunks are 1 MiB, with a small in-flight window. A partial file stays partial until its final length and digest match. Only then does the local replica become complete.

The digest detects corruption or the wrong bytes. It is an integrity check, not encryption.

## Where the current design bends

On `main`, metadata, blobs, and heartbeats share one TCP connection and one send queue. Under a large transfer, control traffic can wait behind bulk traffic.

The newer integration harness reproduces the serious version of that weakness: in a contended three-device mesh, a heartbeat can starve behind blob backlog and the connection oscillates.

Other limits are related:

- blob catch-up still has a scalar-cursor path on `main`;
- a blob fetch chooses one source at a time;
- mobile background sync is not implemented;
- device identity is not cryptographically authenticated;
- the current wire is plain TCP, not end-to-end encrypted.

These are reasons for the next protocol, not details to hide behind a “private sync” label.

## What has landed off `main`

The optimization branch already contains foundational changes that are not yet part of the public working build:

- a simulated-cluster and real-TCP integration harness;
- vector-only catch-up for entities and blobs;
- a clean storage-v2 schema;
- explicit present/absent replica registers;
- a reference-only dirty outbox.

The next dependency chain is deliberate:

```text
identity → control/bulk transport → connection rebuild → piece blobs
         → app-facing sync kit → scopes → optional cloud mailbox
```

Control and bulk traffic separate first. Blob transfers then become piece-verified and able to use more than one source. Only after the LAN foundation behaves under realistic loss, latency, and congestion does the optional cloud layer begin.

LAN first is therefore not a slogan about avoiding servers forever. It is an ordering decision: make nearby devices work directly and honestly before adding a remote safety net.
