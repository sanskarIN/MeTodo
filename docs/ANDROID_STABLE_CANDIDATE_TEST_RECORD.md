# MeTodo v1.0.0 — Signed Android candidate verification record

**Status: NOT TESTED — fill with direct device evidence before stable release.**

This checklist is for the **production-signed** APK, not the passing GitHub
Actions debug APK. No signature material, API tokens, private notes, or device
account credentials should be entered in this document.

## Build identity and installation record

| Field | Release owner to fill |
|---|---|
| Final reviewed protected-main commit (40-character SHA) | Pending |
| Exact EAS signed APK build ID and download page | Pending |
| APK SHA256 | Pending |
| App ID and version displayed | `com.app.metodo`, `1.0.0` — verify |
| Device make/model | Pending |
| Android version and security patch level | Pending |
| Date, tester, and test environment | Pending |
| APK signing certificate fingerprint (public fingerprint only) | Pending |

Preserve an independent SHA256SUMS file, and ensure the APK SHA agrees with
the file tested. Do not publish an APK built from an older reviewed commit.

## Required device smoke tests

Mark each row Pass/Fail/Not tested with a short evidence link or issue ID.

| Scenario | Result | Evidence / issue |
|---|---|---|
| Install signed APK and launch without network connection | Not tested | |
| Create two tasks quickly; restart app and confirm both persist | Not tested | |
| Edit task title, priority, description and due date; restart and verify | Not tested | |
| Complete/uncomplete task; force-stop app and verify state | Not tested | |
| Delete a task, relaunch, and verify it remains deleted | Not tested | |
| Change categories, settings, theme and avatar; relaunch to verify | Not tested | |
| Export a real JSON backup file via Android share/save sheet | Not tested | |
| Verify file was saved outside temporary app cache and can be reopened | Not tested | |
| Delete/recreate test tasks; import saved JSON through document picker | Not tested | |
| Confirm imported titles, IDs, due dates, subtasks and reminders | Not tested | |
| Confirm restore asks before overwriting existing local data | Not tested | |
| Reopen after restore; check no partial or duplicate tasks | Not tested | |
| Explicit Clear All Data removes tasks and pending recovery | Not tested | |
| Deny calendar permission and confirm graceful error handling | Not tested | |
| Grant calendar permission; link a dated task to selected calendar | Not tested | |
| Update or unlink calendar event; verify app/event consistency | Not tested | |
| Verify reminders only if actually scheduled from the UI | Not tested | |
| Check light/dark UI, system font scaling and touch accessibility | Not tested | |
| Run online and offline to ensure app does not promise cloud sync | Not tested | |
| Inspect Android app permissions and public privacy information | Not tested | |

If a crash or incorrect state is encountered, capture a sanitized log and
create a tracked issue. **Do not paste user task data into a public issue.**

## Security and release readiness

- [ ] Core CI + all 11 protected-main required checks pass on the final SHA.
- [ ] `pnpm audit --prod --audit-level high` passes on the final SHA.
- [ ] Remaining moderate/low advisory exposure is evaluated.
- [ ] Android signing keystore is managed securely in Expo/EAS.
- [ ] Independent write-access PR approval and environment approvals obtained.
- [ ] Release notes state limitations: no authenticated sync, real-time
      collaboration, voice-to-task capture or public desktop/iOS installers.
- [ ] APK, web archive and SHA256SUMS are verified before GitHub publication.
- [ ] Release owner authorizes stable publication after installation testing.

## Required issue #11 evidence comment

Before requesting publication, copy a sanitized summary of this verification to
a comment on <https://github.com/sanskarIN/MeTodo/issues/11>. The GitHub API
will verify that it was posted by a repository owner/collaborator and includes
each of these exact strings:

- The full **40-character protected-main source commit SHA**.
- The **64-character lowercase SHA256** of the production-signed APK actually
  installed and exercised on Android.
- The **64-character lowercase SHA256** of the web archive from the same
  candidate workflow run.

Include the device/Android OS, test results, candidate run URL, known issues
and decision. Do not paste private task content, credential material or any
other personally identifying device information. Copy the comment's permanent
URL (`#issuecomment-...`) as `deviceTestEvidenceUrl` in the publish workflow.

## Reviewer conclusion

**Decision:** Pending.

**Known failures / waivers (include approval and rationale):** Pending.

**Reviewed protected-main SHA:** Pending.

**Release owner approval:** Pending.
