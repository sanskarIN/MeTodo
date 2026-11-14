# MeTodo first stable release gate

Updated: 2026-11-14

## Release decision

**NOT YET APPROVED FOR STABLE PUBLICATION.** The checked-in version number and
historical reports do not establish a published, installable GitHub release.
Do not create a `v1.0.0` stable release until the criteria below are evidenced
against the **final protected main commit**.

## Required evidence

- [ ] Merge the validated CI/calendar branch via protected-branch review; do not bypass reviewer and required-check rules.
- [ ] Required checks on main are green after integration: TypeScript, tests, lint, server bundle, and clean Expo web export.
- [ ] Android native build produces a real APK, which is installed and smoke-tested on a device.
- [ ] Task create/edit/complete/delete survive force-close, restart, and rapid consecutive mutations.
- [ ] Existing stored task dates, subtasks, reminders, and calendar links reload correctly.
- [ ] Test offline task creation, reconnect, and honest indication of which sync capabilities are real versus simulated.
- [ ] Confirm platform permission flows, notification scheduling, and reminder cancellation on actual Android devices.
- [ ] Verify export/import recovery using a backup before and after app restart.
- [ ] Validate accessibility, light/dark theme, and layout in a real web browser and on Android.
- [ ] Run dependency/security audit; triage or fix high-severity findings.
- [ ] Verify version, package/bundle IDs, privacy information, change notes, hashes and release assets.
- [ ] Configure Expo project ownership and store signing credentials outside Git; verify a signed production build.
- [ ] Review release artifact manifests and ensure the installer/build named in the release actually exists.

## Known blocking findings

1. A prior `main` branch CI run failed on every platform during tool setup.
2. PR #14 provides the new CI/calendar integration with one correctly attributed commit; it still requires an independent approving review. PR #1 has been closed.
3. The original release workflow used `if: always()` for release creation, risking incomplete releases. The release branch removes this unsafe publication condition.
4. The original platform release workflow relied on missing native installer scripts. The new first stable release workflow targets only a signed Android APK and a web archive.
5. The backend-sync client's queue persistence is unfinished; offline sync includes a simulated network request. Do **not** advertise verified cross-device sync.
6. App-level speech task service parses text but does not implement device speech-recognition capture. Do not advertise end-to-end voice recognition.
7. Collaboration service holds team data in process memory. Production account-backed collaboration needs persistence and authorization tests.
8. GitHub protection currently blocks merging without an independent approving review. This is a deliberate gate and should remain enabled.

## Platform release scope

The initial offline-first stable app should prioritize a verified Android
distribution and web experience. iOS and desktop artifacts must be described as
**not released** until their native binaries are actually built and tested. A
web compatibility bundle is not a Windows EXE, macOS DMG, or Linux AppImage.

## Release procedure

1. Merge through protected PRs only after checks and review.
2. Build the release candidate from the final main SHA, not an unmerged branch.
3. Have a human install and exercise the APK; test on more than one Android version.
4. Run backup/restore and upgrade tests on existing user data.
5. Record exact artifact files, SHA-256 checksums, tested commit and known limitations.
6. Publish stable only after the release owner reviews the above evidence.

## References

- [Pull requests](https://github.com/sanskarIN/MeTodo/pulls)
- [GitHub Actions](https://github.com/sanskarIN/MeTodo/actions)
- [Release page](https://github.com/sanskarIN/MeTodo/releases)

## Android and web publication workflow

The first GitHub stable release explicitly targets a **production-signed Android
APK** and a **browser distribution archive**. Windows EXE, Linux AppImage,
macOS DMG, iOS IPA, and Google Play AAB are not promised by this first release.
The workflow `.github/workflows/release-workflow.yml` does not publish when a
tag is pushed.

Before an owner can manually dispatch the workflow from protected `main`:

1. Link the repository to its actual Expo/EAS project (`eas init` or
   `eas build:configure`); commit the approved EAS project reference in app
   configuration without credentials. Set up the Android signing key securely
   through Expo managed credentials. Neither the token nor private key belongs
   in source control.
2. Configure the GitHub Actions secret `EXPO_TOKEN` and the `eas-signing`
   environment for signed EAS builds.
3. Configure the GitHub `stable-release` environment with independent
   required reviewers. After successful installation testing and approved
   release notes, set `METODO_RELEASE_APPROVED_SHA` to the exact reviewed
   40-character `main` commit in GitHub Actions secrets. Change or delete
   it after promotion so future commits cannot reuse the approval.
4. Confirm required main checks, native APK smoke testing, backup restore,
   permissions, accessibility, dependency review, and privacy requirements.
5. Manually dispatch **First Stable Release (Android + Web)** from `main`
   using the same commit in `approvedCommit`, the package version in
   `version`, and the intended channel. The release job fails if approval is
   missing, source or version differs, EAS signing fails, or either expected
   artifact is missing/invalid.

The EAS profile `production-apk` requests an installable Android release
APK using managed signing. The standard `production` profile is reserved for
store-targeted AAB distribution. A passing unsigned GitHub debug APK build
does **not** satisfy the stable signing requirement.

Do not mark the first release as completed until the signed build is installed
and the GitHub release contains both real artifacts and SHA256SUMS.

Official build format guidance:
https://docs.expo.dev/build-reference/apk/
https://docs.expo.dev/build/internal-distribution/

## Local data integrity validation

All four app storage keys now use serialized reads, mutations and explicit resets:
`metodo_tasks`, `metodo_categories`, `metodo_settings`, and `metodo_avatar`.
Failed storage operations are surfaced rather than silently succeeding. Invalid
stale task edits and duplicate task creation are rejected. Each key hydrates
independently so a corrupt settings key does not mask saved tasks. Regression
tests cover mutation collisions, storage failures, corrupt data, and reset
ordering. Real Android restart/storage-pressure testing is still required.

## Backup and restore (new candidate)

The `Local Backup & Restore` screen provides JSON backup from current local
state, and explicit, confirmed replacement of tasks, categories, themes,
settings and avatar. Android uses a user-initiated share sheet; the web build
offers a JSON download. Both accept pasted JSON for restore. The backup
contains sensitive task titles and notes, and must be saved to a private
location. Restoration validates the entire document before writing any key.
It journals the validated backup and automatically retries unfinished writes
on the next app launch after a crash or storage failure. The journal is
removed only after all keys are persisted. An import is not a multi-key ACID
transaction; if recovery fails, keep the source backup and retry. Unit tests
cover round trips, malformed input, and interrupted recovery; manual Android
share/restore/restart testing is still a release gate.

Web users can select a saved JSON file directly; Android uses explicit
paste from clipboard or manual text entry. A user-triggered **Clear All Data**
operation also discards a pending restore journal before clearing the keys, so
previous imports cannot reappear after a deliberate erase.

## Release identity and dependency audit

The pnpm package is named `metodo` (not the generated `app-template`),
and the Expo deep-link scheme is `metodo` (not the template-agent scheme).
The Android/iOS package identifier remains `com.app.metodo` until the
owner explicitly approves its permanent identity **before production signing**.
Core CI and the protected manual Android/web release both run a production
dependency audit at the `high` threshold. Any high/critical advisory or
registry audit failure blocks the run until reviewed/remediated. Do not
bypass or silently ignore audit findings.

## Dependency remediation evidence (2026-11-14)

The original production audit had **2 critical and 81 high** advisories.
A compatible-range package refresh plus a patched image decoder with a Metro
compatibility adapter reduced the isolated candidate to **zero critical and
zero high**, with 3 moderate and 1 low remaining. TypeScript, 48 tests,
lint, server bundle, and web export passed **on the isolated candidate**.
The release branch must still pass its own exact-SHA audit and platform CI
checks before this gate is marked satisfied. Full evidence and the adapter
rationale: `docs/SECURITY_AUDIT_FIRST_STABLE.md`.

## Boot-time data and backup safety

Local data loads with an explicit `loading` / `ready` / `error` status.
The home and task lists do not display misleading zero-task screens if any
local store is unreadable. Task writes are blocked until all saved data is
available; the backup screen cannot export partial in-memory React snapshots.
Export reads from the serialized persisted stores, after pending writes finish.
If loading fails, the user can restore a known-good backup or clear data from
Settings; neither operation silently overwrites corrupt data. Unit tests
cover backing-store exports and fail-closed corrupt-data handling. Device
restart, low-storage conditions and UI accessibility remain manual gates.
