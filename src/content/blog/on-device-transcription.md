---
title: "On-Device Audio Transcription with Whisper"
date: 2026-04-08
category: research
excerpt: "How we run OpenAI's Whisper model entirely on-device for private, offline audio transcription."
---

One of RECN's core features is automatic transcription — converting your recordings to searchable text. But we had a hard requirement: **no audio leaves the device.**

## Why On-Device

Cloud transcription services are fast and accurate, but they require uploading your audio to a third-party server. For musicians, this is a non-starter. Unreleased ideas, vocal takes, songwriting sessions — this audio is sensitive intellectual property.

Running transcription on-device means:

- **Privacy by architecture**, not by policy
- **Works offline** — no internet needed
- **Zero ongoing cost** — no API calls, no subscriptions
- **Low latency** — no upload/download round trip

## The Implementation

We use `whisper_ggml`, a GGML-based port of OpenAI's Whisper that runs efficiently on mobile hardware. RECN ships four model sizes:

- **Tiny** (74 MB) — fast, good for voice memos
- **Base** (141 MB) — balanced quality and speed
- **Small** (461 MB) — high accuracy
- **Medium** (1.4 GB) — best quality, recommended for music-adjacent audio

Models are downloaded on-demand with integrity verification. The user chooses which models to keep on-device via a dedicated model manager screen.

## Background Processing

Transcription runs as a background task in RECN's processing pipeline. When a recording finishes, it's queued for transcription automatically. The pipeline is extensible — the same architecture handles waveform extraction, audio classification, and DSP analysis.

The key constraint: transcription must never block the recording flow. A user should be able to stop one recording and immediately start another without waiting for processing to complete.

## Language Detection

Whisper supports automatic language detection across 99 languages. RECN uses this to tag recordings with their detected language, making multilingual libraries searchable without manual tagging.

## What's Next

We're exploring smaller, faster models optimized specifically for music-adjacent audio — spoken annotations over instrument backing, sung melodies, rhythmic dictation. Standard speech models handle these adequately, but purpose-trained models could significantly improve accuracy for our use case.
