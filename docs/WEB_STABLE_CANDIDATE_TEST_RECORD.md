# Web-only MeTodo v1.0.0 — candidate QA record

**Template; no test is marked passed until a human tests the exact candidate.**

## Candidate provenance

- Version: \`1.0.0\`
- Protected-main commit SHA (40 lowercase hex): \`<enter exact SHA>\`
- Successful **Build Web Release Candidate** run URL/ID: \`<enter>\`
- Downloaded artifact name: \`MeTodo-v1.0.0-web.tar.gz\`
- Downloaded web archive SHA-256 (64 lowercase hex): \`<enter>\`
- Date/time of QA and tester: \`<enter>\`
- Browser/OS versions and viewport sizes: \`<enter>\`
- Hosting location/origin of tested archive: \`<enter>\`

A local development server is not the production web archive. Extract the **downloaded artifact** and serve it from an HTTP(S) origin supporting static asset paths. Inspect developer-console errors, asset loading and navigation. Record any production-hosting routing/rewrite requirements. **Do not expose private task content in public evidence.**

## Browser QA matrix

Record **PASS / FAIL / NOT TESTED** and a sanitized note for each:

| Scenario | Chromium desktop | Firefox desktop | Safari/WebKit | Narrow viewport |
| --- | --- | --- | --- | --- |
| Production archive loads without runtime errors | | | | |
| Create/edit/complete/delete task; date and category | | | | |
| Refresh, close and reopen: local tasks remain | | | | |
| Rapid repeated changes do not lose updates | | | | |
| Theme, avatar and preferences persist | | | | |
| Export JSON and securely save outside browser | | | | |
| Import valid JSON with explicit confirmation | | | | |
| Reject invalid JSON without overwriting tasks | | | | |
| Restore interrupted/corrupted storage recovery path | | | | |
| Keyboard-only navigation, labels and visible focus | | | | |
| Narrow layout, scrolling and light/dark contrast | | | | |
| Offline behavior accurately described (test actual cache) | | | | |

## Privacy and known limitations

- Web task data is local to a particular browser **origin and profile**; private/incognito browsing or cleared site data can erase it.
- A JSON backup can include private titles, notes and settings; store it securely and test restoring it.
- Browser storage alone does **not** prove offline initial loading; do not claim a service-worker/PWA guarantee without verification.
- Account-backed cloud sync, shared collaboration, reliable background reminders, voice capture, Android/iOS publishing and native desktop installers are outside this v1.0.0 scope.
- Record crashes, accessibility defects, untested browsers and unfinished features. Any material data-loss defect blocks publication.

## Public evidence comment on issue #16

Post a **sanitized**, factual comment at https://github.com/sanskarIN/MeTodo/issues/16 with:

- Exact protected-main SHA: \`<SHA>\`
- Exact tested web archive SHA-256: \`<HASH>\`
- Candidate run URL/ID and tested browsers/OS versions
- QA matrix summary, failures/not-tested items and known limitations
- The line **\`Web QA: PASS\`** *only if you really performed and passed the required QA*

Copy the **direct issue-comment URL**, not the issue page URL. The manual publication workflow checks that the issue #16 comment was made by an owner/collaborator, includes both exact hashes and the \`Web QA: PASS\` declaration. This check cannot independently prove browser testing: the release owner must review evidence before approving the protected environment and SHA.

## Independent release approval

After required protected-main reviews/checks pass and QA has succeeded, privately set \`METODO_RELEASE_APPROVED_SHA\` to the same commit in GitHub. Review the \`stable-release\` protected environment and manually dispatch **Publish Tested MeTodo Web v1.0.0 (Manual Approval)** with version, approved commit, candidate run ID, tested web SHA-256, the issue #16 comment URL and browser QA confirmation.

**Do not publish on missing or failed evidence. No Android APK/AAB is part of this release.**
