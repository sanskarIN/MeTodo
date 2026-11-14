# MeTodo first-stable dependency security audit

Date: 2026-11-14. Source: reproducible GitHub Actions scans using pnpm 9.12.0.

## Evidenced remediation

| Candidate | Critical | High | Moderate | Low | Total |
|---|---:|---:|---:|---:|---:|
| Original production dependencies | 2 | 81 | 42 | 11 | 136 |
| Compatible-range package refresh | 0 | 5 | 6 | 1 | 12 |
| Refreshed graph + secure Metro image-size adapter | 0 | 0 | 3 | 1 | 4 |

Runs (evidence; each audit reflects that run's commit, **not** the latest PR by default):

- Original audit failed: https://github.com/sanskarIN/MeTodo/actions/runs/43561880421
- Compatibility refresh (frozen install succeeded; five highs remain): https://github.com/sanskarIN/MeTodo/actions/runs/43562432485
- Direct image-size 2.x override failed Expo asset export (not used in final candidate): https://github.com/sanskarIN/MeTodo/actions/runs/43562614555
- Compatibility shim candidate: https://github.com/sanskarIN/MeTodo/actions/runs/43562910715 — source typecheck, 48 tests, lint, server build, frozen install and Expo web export passed; `pnpm audit --prod --audit-level high` exit code **0**.

## Why the image-size adapter exists

Metro 0.83 consumes image-size 1.x with a filename string. Patched image-size
2.0.3 accepts image **bytes**, causing a Metro asset export failure when
globally overridden. The small local package at
`vendor/image-size-compat` preserves Metro's filename API while delegating
decoding to `image-size@2.0.3`. It uses no vulnerable image decoder and
is included in the lockfile as a local package. The adapter must continue to
be tested on Android and web when Expo/Metro changes.

Other pinned dependency overrides are `postcss >=8.5.18` and
`decode-uri-component >=0.5.1`. All were tested via a full Expo web export.

## Decision gate

No critical or high advisories remained **in the isolated test candidate**.
The source changes in PR #14 must independently pass the same frozen
install, audit, TypeScript, tests, lint, server bundle, web export, and native
build checks from its exact final SHA before treating security as cleared.
Three moderate and one low advisories remained in the test candidate.
Review each before stable release; these figures are advisory counts, not
a guarantee that every runtime path is risk-free.

An audit passing does **not** replace authenticated feature review, Android
signing, real-device smoke tests, privacy review, protected-branch approval,
or final human release approval.
