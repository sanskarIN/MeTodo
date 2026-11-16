# MeTodo first stable release gate — web-only v1.0.0

Updated: 2026-11-16

## Decision and scope

**NOT READY FOR PUBLICATION.** First stable v1.0.0 targets **one verifiable, static web archive only**. This is an intentional scope change from the previous Android + web candidate. Android source remains available for future development, but Android APK/AAB, Expo/EAS signing and physical Android tests are **not** required or promised for v1.0.0. Native Windows/macOS/Linux packages and iOS binaries are likewise deferred. Passing web exports on Windows/macOS/Linux runners **does not produce** installable native desktop applications.

No release tag may be created or published based only on a passing PR, version in package.json or optimistic historical feature reports.

## Hard blockers

1. [ ] Review and merge the **clean one-commit, web-only first-stable PR** through the **protected-main** ruleset, preserving the required independent approving review and mandatory checks.
2. [ ] On the final merged **main** commit, all branch-protection-required checks pass. The core `Validate MeTodo` check includes frozen dependencies, TypeScript, unit tests, lint, server bundle, web export and a high-severity production security audit.
3. [ ] Produce a versioned archive from that **same exact final main SHA** using the manual **Build Web Release Candidate** workflow. The workflow checks the approved SHA and version, runs quality/security gates, exports static web assets and uploads `MeTodo-v1.0.0-web.tar.gz` and `SHA256SUMS-candidate`. It does **not** publish.
4. [ ] Download that workflow's archive, confirm the recorded SHA-256 and actually serve/test the extracted **production static build** in browsers. Do not substitute development-server testing.
5. [ ] Record passes, failures and known limitations in [web QA template](WEB_STABLE_CANDIDATE_TEST_RECORD.md). Test task CRUD/reload, rapid changes, web JSON backup/restore, corrupt input rejection, accessibility/keyboard focus, responsive layout, themes, storage failure messages, privacy and security.
6. [ ] Cross-browser QA: current Chromium, Firefox, Safari/WebKit where available, plus narrow viewport. If a browser or behavior is untested, disclose it honestly; release-owner judgment must determine whether it blocks shipment.
7. [ ] File a **sanitized, owner/collaborator-authored** issue [#16](https://github.com/sanskarIN/MeTodo/issues/16) comment with full final main SHA, exact archive SHA-256, run ID, browser QA evidence and `Web QA: PASS` only after genuine successful testing.
8. [ ] Independently approve the exact tested SHA, configure the protected `stable-release` environment with human review, privately set `METODO_RELEASE_APPROVED_SHA` to that SHA and dispatch the **Publish Tested MeTodo Web v1.0.0 (Manual Approval)** workflow with candidate run ID, archive hash and direct issue #16 comment URL.
9. [ ] Verify the published `v1.0.0` contains only the tested web archive and `SHA256SUMS`. Check archive integrity, public links and release notes; do not advertise unshipped installers.

## Two-stage workflow contract

`.github/workflows/release-workflow.yml` is **build only**. It must run by manual dispatch from protected `main`, require its exact 40-character commit SHA, reject existing tags or mismatched versions, use a frozen pnpm install, fail high/critical production advisories, run tests and export web. It uploads a private candidate artifact and SHA-256 manifest.

`.github/workflows/publish-stable.yml` is **promotion only**. It must run by independent manual dispatch on the **same protected-main SHA**, with the matching `METODO_RELEASE_APPROVED_SHA` secret and a `stable-release` environment review. It verifies that the referenced candidate run was a successful workflow_dispatch of the named build workflow from this exact main SHA; confirms `Validate MeTodo` passed; verifies the actual owner/collaborator issue #16 comment contains the same SHA/hash and `Web QA: PASS`; downloads **only** the named candidate artifact from the named run; verifies the archive and both tested hash and candidate manifest; refuses an existing tag; and publishes only the exact previously inspected web archive and its checksum. It must not silently rebuild, bypass tests, publish an Android file or run on tag push.

**These mechanical checks do not replace a real human review of browser test evidence.** The owner must never mark `Web QA: PASS` without performing required testing.

## Web functionality and limitations

The offline-first design persists task data locally in browser storage when the relevant storage implementation functions. It is **not** automatic account-backed synchronization, and clearing site data or using private/incognito mode can lose locally stored data. User-generated JSON backups are sensitive and should be stored privately. Automatic offline startup / PWA service-worker caching is **not yet validated**; do not promise it merely because tasks persist after a page refresh while online.

Only tested task creation, editing, completion, deletion, categories, preferences and JSON backup/restore should be presented as first-stable product features. Native device-calendar integration, production cloud sync, voice recording, durable team collaboration and reliable scheduled notifications are not claimed as shipping on web until verified end to end. Existing examples, development APIs, prototype UI and broad historical feature documents do not change this narrow support contract.

Data safety regressions already addressed in PR #14 include serialized local writes, fail-closed hydration, date rehydration, backup validation and a recovery journal. **Browser QA** still needs to exercise failure recovery and production web import/export in the exact tested archive. There is no claim of ACID transactions across multiple browser storage keys.

## Android deferred, not deleted

Android-related app config, source, development-only build workflows, EAS helper and legacy manual test template may remain for future work. They do not produce a v1.0.0 APK, do not require production signing, and do not block the web-only release on account of absent Expo credentials. [Issue #11](https://github.com/sanskarIN/MeTodo/issues/11) tracks later Android release preparation. Browser QA replaces device QA for the first stable. The existing protected-main branch ruleset may require some platform validation checks for code integration; do not bypass that independent policy.

## Security and release transparency

The isolated remediation trial reported 0 critical, 0 high, 3 moderate and 1 low advisories (see [security audit](SECURITY_AUDIT_FIRST_STABLE.md)). This is **historical evidence**, not a substitute for an audit on the exact final main source. Review remaining advisories, privacy statements, dependency changes and deployment host configuration before publication.

The version number alone does not make MeTodo stable. At the time of this document update the release remains **unpublished and unapproved**.

References: [PRs](https://github.com/sanskarIN/MeTodo/pulls), [GitHub Actions](https://github.com/sanskarIN/MeTodo/actions), [release page](https://github.com/sanskarIN/MeTodo/releases), [browser QA issue #16](https://github.com/sanskarIN/MeTodo/issues/16).
