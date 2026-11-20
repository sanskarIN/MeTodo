# Windows native trial: dependency security block (18 November 2026)

The unsigned Windows diagnostic installer is a development-only artifact and is not part of the web-only MeTodo v1.0.0 stable release.

## Confirmed gate failure

At PR #22 source `db55dc39e08a729d9bc90bcf18cadeb82e67462f`, the Windows native workflow completed TypeScript, 68 passing tests (1 skipped), and lint, then failed `pnpm audit --prod --audit-level high`. The audit reported 2 high and 3 moderate vulnerabilities. One high issue, [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) (CVE-2026-112366), affects `picomatch <=4.0.7` through the Expo CLI dependency chain. As of 18 November 2026 the advisory lists no upstream patched version. Do not claim that updating to 4.0.7 resolves this advisory.

## Diagnostic workflow policy

- Run TypeScript, tests and lint **before** building.
- Build an **unsigned, SHA-identified trial** and upload its diagnostics so the WebView2 layout fault can be tested even when an upstream dependency audit fails.
- Run the full existing **production dependency audit** after the diagnostic artifact is uploaded. On high-severity findings, the workflow **fails** and adds a blocking notice to the summary. Never hide or ignore advisory findings to get a green check.
- Do not merge as release-ready, publish as stable, or distribute the unsigned artifact as trusted while the audit is failing.
- Confirm a reviewed upstream fix or acceptable complete remediation, regenerate the frozen lockfile, and require a new green audit at the exact final commit before release.

## Separate Windows release gate

Even when the dependency audit clears, test a SHA-matched native build on a real Windows 11 device: initial content paint, Home/Tasks/Settings/Create Task navigation, resize/maximize, real CRUD, backup/restore, persistence across restarts and offline first launch. CI automation is useful evidence but not a substitute for installed-device QA.

Current web-only release candidate is separately tracked in PR #17; do not add a Windows installer to v1.0.0 without explicitly revising its approved scope.
