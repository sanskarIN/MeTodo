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

Before building the release candidate from protected `main`:

1. Obtain the required last-push approving PR review and merge using the
   protected-main ruleset only after all checks pass. The required checks
   must run again against the merged source SHA on main.
2. Confirm the permanent Android package ID and link the repository to its
   actual Expo/EAS project (`eas init` or `eas build:configure`). Commit
   only the non-secret EAS project reference. Set up the managed Android
   signing credentials privately, never in source control.
3. Configure `EXPO_TOKEN` privately in GitHub Actions and the
   `eas-signing` deployment environment. Have the owner review the security
   and release prerequisites, including dependency audit results.
4. Manually dispatch **Build Signed Release Candidate (Android + Web)**
   (`.github/workflows/release-workflow.yml`) from the reviewed protected
   `main` commit with the exact source SHA and package version. This
   builds a signed APK and browser archive, verifies the APK signing identity,
   uploads the artifacts, and **never publishes a GitHub release**.
5. Download and verify the signed APK and web archive. Install the signed
   APK on physical Android devices, test task persistence, JSON file
   export/import and recovery, permissions, accessibility and privacy.
   Record results in `docs/ANDROID_STABLE_CANDIDATE_TEST_RECORD.md`
   and post a sanitized owner/collaborator comment with source SHA and both
   SHA256 hashes on issue #11.
6. After real device testing and final owner approval, configure the
   `stable-release` environment and exact `METODO_RELEASE_APPROVED_SHA`
   approval secret, then manually dispatch **Publish Tested MeTodo v1.0.0
   (Manual Approval)** (`.github/workflows/publish-stable.yml`) with the
   candidate run ID, the tested APK and web hashes, the issue #11 comment URL
   and explicit physical-test confirmation. Required checks on the same main
   SHA must still be green. The publication workflow downloads only artifacts
   from that successful candidate run and validates the hashes before release.

The `production-apk` profile creates an installable EAS-signed Android APK.
The `production` profile is reserved for store-targeted builds. **A passing
debug APK is not proof of a signed stable release.** Native installer targets
(Windows/macOS/Linux) and public iOS packages remain outside v1.0.0 scope.

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
settings and avatar. Android uses a user-initiated **JSON file** share sheet; the web build
offers a JSON download. Android can import JSON through the system document
picker and the web build has a file chooser. Both also accept pasted JSON
for restore. The backup
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

## Native JSON backup artifacts (SDK 54)

The Android backup action now writes a JSON file in the app's private cache
and offers the OS share/save sheet via Expo FileSystem + Sharing. The import
screen uses Expo DocumentPicker to copy a selected JSON file to the sandbox,
checks its size and validates content **before** displaying the pending
replacement. Users should verify their external file was saved to a private
location; app cache is temporary and is not itself a user backup.

This was validated in an isolated compatibility workflow with a frozen pnpm
install, 50 unit tests, TypeScript, lint, server bundle, web export and
security audit passing:
https://github.com/sanskarIN/MeTodo/actions/runs/43568656569

Release confidence still requires installing the new APK on a real Android
phone and verifying that a shared JSON file can be saved, re-selected and
restored after app restart. Tests and web export do not prove Android file
provider interoperability.

## Signed Android test evidence template

Before manually promoting a successful signed APK, record build identity,
SHA256, device/Android versions, install and restart behavior, JSON file
share/import, calendar permissions, task persistence, privacy and accessibility
results in `docs/ANDROID_STABLE_CANDIDATE_TEST_RECORD.md`. No section should
be marked passed without evidence from the actual tested signed file.

## Storage failure messaging and calendar consistency

Avatar and theme saves now report storage failures and keep the editor open
instead of navigating away. Device-calendar picker/link/sync/unlink actions
reset their busy state in `finally` and explicitly warn when a calendar
operation may have partially succeeded before a local persistence failure.
These changes do **not** make calendar and local storage writes atomic; Android
smoke testing must verify recovery from permission changes and partial writes.

## Category and avatar hydration safety

The task-creation and avatar editor screens must not initialize editable
fields from the initial default context before asynchronous storage loading.
They now show a loading or recovery state and populate saved categories/avatar
values after successful hydration. The task detail screen also distinguishes
missing tasks from loading failures; stale detail state is cleared when a task
is removed. Verify these transitions on Android after a force-stop/restart.

## Mandatory two-stage release publication gate (2026-11-14)

The release process intentionally separates **candidate generation** from
**stable GitHub publication**. This prevents a signed APK from being published
before it has been installed and tested by the release owner.

1. Merge PR #14 through the protected main ruleset (last-push review and
   required checks); do not merge until all new CI runs have passed.
2. On protected main, link an EAS project and configure its managed Android
   signing identity. Add `EXPO_TOKEN` privately as a GitHub Actions secret.
   Configure `eas-signing` and `stable-release` environments with required
   human reviewers as appropriate. The permanent application identifier must
   be approved **before** credentials are issued.
3. Dispatch **Build Signed Release Candidate (Android + Web)** on main with
   version `1.0.0` and the approved exact 40-character main SHA. This uploads
   the signed Android APK, web archive, signing certificate evidence and hashes
   as **private workflow artifacts**; it does **not** publish a GitHub release.
4. Download the signed APK directly from the successful candidate workflow
   artifacts, verify its SHA256, install it on a physical Android device and
   test persistence, calendar permissions, backups, restore, restart, privacy,
   and accessibility. Inspect the web archive and record its SHA256, too.
5. Add a sanitized test report as a comment on issue #11, using the record
   template `docs/ANDROID_STABLE_CANDIDATE_TEST_RECORD.md`. Do not post
   private tasks, signing secrets or device identifiers.
6. After the owner independently approves the **tested exact APK** and its
   originating protected-main SHA, set `METODO_RELEASE_APPROVED_SHA` to
   that exact commit in the GitHub environment/repository secrets.
7. Dispatch **Publish Tested MeTodo v1.0.0 (Manual Approval)** on the same
   protected-main SHA. Provide the successful candidate workflow run ID,
   the tested APK SHA256, the web archive SHA256, and the direct GitHub issue
   #11 test-evidence comment URL. Confirm the device-tested checkbox.
   The protected `stable-release` environment should require independent
   human approval before this step is allowed to run.
8. The publish job refuses a mismatched source SHA, missing owner approval,
   wrong candidate run, failed required checks, missing test evidence, wrong
   digest, preexisting version tag or missing assets. It downloads **only the
   identified candidate run's artifacts**, never silently rebuilds them or
   substitutes a debug APK, and publishes those exact checked files and
   `SHA256SUMS`.

Workflow names:
- `.github/workflows/release-workflow.yml` — build only, no publication.
- `.github/workflows/publish-stable.yml` — separate, human-gated promotion.

The core CI checks workflow syntax of both. This documented procedure is
the stable-release contract; the earlier single-step EAS/publish instructions
above are superseded wherever they suggest immediate publication.

## Required checks after merging to protected main

The five platform `Test Android/iOS/Linux/macOS/Windows Build` jobs must run
**both on PRs and on protected-main pushes**. Earlier workflows skipped tests
on main and the release gate required impossible-to-satisfy checks. Every
platform test now runs for `pull_request` and for `refs/heads/main`, but
not automatically for tag pushes. The manual publication workflow checks all
11 required names against the **same exact main SHA**, refusing to publish if
any are missing, skipped, failed or not complete. CI unit tests assert this
workflow behavior before merging.

## Automated provenance check for signed-device test evidence

The publication job calls GitHub's Issues API to verify that the submitted
issue-comment URL exists, belongs specifically to MeTodo issue #11, and was
written by the repository owner or a collaborator/member. The comment must
contain the **full protected-main source SHA**, the **exact tested APK SHA256**,
and the **exact web archive SHA256**, matching publication inputs. The workflow
will reject fabricated URLs, evidence for another issue or candidate, stale
hashes or unapproved authors. Humans must still validate the completeness and
credibility of the described physical-device tests; API checks cannot prove
those tests occurred.
