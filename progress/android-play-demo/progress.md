# Android Play review demos

- [x] Record real background microphone and media playback flows on a fresh Android 12L / API 32 emulator. Evidence: the two MP4s under `public/media/android-review/`, captured from RECN 0.0.1 (138), app commit `30c2bc83`.
- [x] Use no personal content. Host microphone and cameras were disabled. Recording captured silence; playback used an imported synthetic 440 Hz test tone. Android `screenrecord` does not capture audio.
- [x] Verify both foreground services during the demonstration with Android's service state and visible notifications. The microphone recording continues outside the app and stops from its notification; playback pauses and resumes from Android's media controls.
- [x] Add a public review page with inline video controls, direct MP4 links, and text descriptions. Both videos are H.264, 720 × 1520, with fast-start metadata. Only the beginning/end were trimmed; the shown interactions run at their original speed.
- [x] Verify locally: `npm run build` succeeds, both complete videos decode with FFmpeg without errors, and the browser loads both videos at their expected dimensions and duration. Direct video playback was checked in the browser.
- [ ] Merge and publish `/android-review/`, then verify the page and both video URLs on GitHub Pages.
- [ ] Save the live video links in Google Play's foreground-service declaration and submit the first open-testing release.

## Related Play readiness

The IARC content rating is saved. Open testing now uses build 138 from app PR #359; replacing build 135 cleared the photo/video permission error. The foreground-service declaration is the sole remaining error shown by Play release validation. The initial open release still needs review; later updates already promote through CI.
