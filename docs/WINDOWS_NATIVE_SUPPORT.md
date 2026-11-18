# Native Windows MeTodo — build and qualification

**Status (2026-11-16): trial implementation, not a published or runtime-tested Windows application.** MeTodo's present stable candidate remains web-only pending a verified Windows installer and explicit Windows release approval. Android is still deferred.

## Architecture and compatibility

The native Windows shell uses **Tauri 2** and Windows **Microsoft WebView2** to display the Expo Router/React Native Web static production export from the package itself. The app does not need a hosted web page to render its task UI after installation. The Tauri Rust backend exposes no custom shell or filesystem commands. The optional Node/Express backend and its unverified cloud/collaboration endpoints are **not bundled** into the desktop executable.

An **NSIS setup.exe** installer embeds the offline WebView2 installer (roughly 127 MB of extra installer data), so a fresh Windows machine can install the renderer without fetching it during installation. This does not mean every MeTodo feature or network request works offline. Windows 10/11 x64 is the development target; Windows on ARM and older unsupported operating systems are not validated.

The provisional Windows identity is `io.github.sanskarin.metodo`. Confirm identity before signing and publishing. Tauri's WebView2 data directory persists by Windows app profile, not by a remotely hosted account. Deleting the profile, clearing site data or uninstalling the app may remove private tasks; **test and keep encrypted/private JSON backups** rather than assuming local persistence survives arbitrary system cleanup.

## Developer build on Windows

Prerequisites: Windows 10/11 x64, Rust MSVC toolchain, Microsoft Visual C++ Build Tools + Windows SDK, Node 22.13, pnpm 9.12.0, access to toolchain dependencies for the build. Run from repository root:

```powershell
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm lint
pnpm desktop:windows:build
```

This runs the Expo production web export to `dist/windows-web`, creates `src-tauri/icons/icon.ico` from the tracked `assets/images/icon.png` through the pinned Tauri CLI and compiles a native **Windows NSIS setup.exe** under `src-tauri/target/release/bundle/nsis`. Generated icons and Rust build output are ignored by Git. The direct Tauri crates and CLI versions are pinned, and `src-tauri/Cargo.lock` is now committed with the resolved Rust dependency graph. Windows CI runs `cargo metadata --locked` before compiling to detect unintended dependency drift. The committed lockfile must be refreshed deliberately and reviewed when Rust dependencies are upgraded.

The [first successful Windows installer CI run](https://github.com/sanskarIN/MeTodo/actions/runs/43846201553) produced a real offline-capable NSIS setup.exe (~210.5 MiB) and SHA-256 manifest. It was **unsigned** and has not been tested on a Windows desktop. The `Windows Native Installer (Trial)` GitHub Actions workflow compiles on `windows-latest` and uploads a **private trial artifact**, `metodo-windows-native-trial`, containing a Windows installer and `SHA256SUMS`. It checks Authenticode status for visibility only; an unsigned trial does not count as trusted/signed stable delivery. The ordinary `Build Windows` workflow merely validates web export on a Windows runner and should not be confused with a native app build.

## Required Windows QA

- Install, open, exit and uninstall the **exact CI-produced** installer on Windows 10 and Windows 11 x64. Test first installation with and without WebView2, with internet disconnected.
- Confirm task CRUD and completion, rapidly repeated edits, due dates, categories, themes, preferences and avatar settings survive a full process exit and restart. Check a second process/launch, and profile isolation.
- Verify static images/fonts, deep route navigation, window resizing, Windows high DPI scaling (100%, 150%, 200%) and keyboard-only use.
- Confirm JSON download/export, file chooser/import, confirmation, bad JSON rejection, large-file rejection, interrupted restore recovery and protected-task backup privacy using **the real WebView2 native window**.
- Test relevant offline startup paths, automatic recovery after a crash, low storage and denied storage access, Windows user with a non-ASCII home directory.
- Verify accessibility focus/contrast, high contrast, screen reader semantics and light/dark mode.
- Verify signed Windows file metadata, installer checksum, installation and uninstall persistence, upgrade/migration from prior installations and default execution privileges.
- Document any missing native integrations: Windows notifications, device calendar, system tray, start-at-login, auto-updates, voice capture and cloud sync are **not established by this wrapper**.

Report on [issue #18](https://github.com/sanskarIN/MeTodo/issues/18) with the exact 40-character source SHA, successful CI run link, installer name, SHA-256, Windows version, WebView2 version, PASS/FAIL/NOT TESTED for every applicable scenario and sanitized observations. Do not publicly post private task content, signing credentials or device identifiers.

## Release decision

**No automatic publication.** To call Windows supported/stable, finish runtime QA, keep the committed Cargo.lock verified, resolve installation/data-loss issues, obtain an independent protected-main review, configure owner-approved Authenticode signing if needed, verify the actual release candidate on the exact protected-main commit, and extend the separate manual promotion workflow to verify **the exact tested Windows installer hash** in addition to the web archive hash. The existing web-only release gate must not be silently bypassed.

References:
- https://v2.tauri.app/start/prerequisites/
- https://v2.tauri.app/distribute/windows-installer/
- https://v2.tauri.app/reference/config/

## Windows 11 blank-screen retest — 2026-11-17

The owner confirmed that the prior viewport fix still leaves Home/Tasks/Settings blank inside installed WebView2. The earlier passing CI Microsoft Edge HTTP render is insufficient proof that the installed app works. The native trial must remain draft and out of stable publication.

The new Windows-only build now injects a small revision badge into every exported HTML document. The badge gives the exact 12-character source revision; clicking it displays non-private diagnostics. If expected screen content does not become visible, a diagnostic panel appears after 10 seconds showing root/viewport dimensions and script error counts. This instrumentation never reads, clears or transmits tasks. CSS also explicitly sizes the React gesture root. The installer filename includes the source revision so that one trial cannot be mistaken for another. These are unverified mitigations until installed Windows tests pass.

Close any running MeTodo.exe processes before reinstallation. The NSIS installer shares the prior trial's version and app identity. Choose the offered reinstall option rather than assuming it replaces a same-version installation automatically. **Never delete the existing WebView2 profile or AppData to diagnose a blank screen.** Verify setup.exe against SHA256SUMS, confirm the version badge matches the installer filename, test Home/Tasks/Settings, task CRUD, backup/restore, close/reopen persistence and privacy. If the badge is absent, record that the installed binary may still be old, or the diagnostic script may have failed to execute. Report only the technical diagnostic lines, not private task contents.

## Native WebView2 smoke in GitHub Actions (diagnostic follow-up)

A separate advisory Windows CI check now launches the actual compiled Tauri executable using an ephemeral localhost-only Microsoft WebView2 debugging port and tests whether the Home header has a visible rectangle and the revision badge is present. A sanitized NATIVE_WEBVIEW2_SMOKE.txt report is uploaded with trial artifacts when available. It does not read local task storage. This tests a compiled native executable rather than only an HTTP Edge export, but still does not replace installation, upgrade, WebView2 dialogs, JSON recovery and persistence QA on a real Windows 11 computer. If CI cannot host an interactive WebView2 session, the report says NOT VERIFIED; this does not authorize Windows release. This step is explicitly advisory so it cannot prevent generation of a diagnostic setup.exe, and it must never be interpreted as a stable release gate pass when it fails.

## Source provenance and native smoke report correction (2026-11-17)

In pull-request workflows, GitHub's `GITHUB_SHA` can be a temporary synthetic **merge commit**, not the PR source head. An earlier native trial ZIP labeled its installer with that synthetic revision and had no `NATIVE_WEBVIEW2_SMOKE.txt` despite including the report path. The workflow now checks out `github.event.pull_request.head.sha`, checks that the checked-out SHA matches the declared `METODO_SOURCE_SHA`, embeds the exact head revision in the diagnostic bootstrap, and stamps the same revision into the installer filename. Do not interpret synthetic merge SHA filenames as trustworthy source provenance.

The CI step now creates a `NOT VERIFIED` report if the native probe stops before its own report can be generated. **Advisory CI steps can report success even when their underlying probe failed** because `continue-on-error` is enabled to preserve an installer diagnostic artifact. Read the report's `PASS`, `FAIL`, or `NOT VERIFIED` content instead of relying on the green workflow badge. WebView2 runtime 150 may ignore environment-based remote-debug arguments in elevated processes, so unavailable CDP does not alone diagnose a blank UI. This test remains an aid; installed Windows 11 human QA is still required. The debugging port is used only for the ephemeral CI process, never for normal published builds.

## Native probe defect found in build fdec73a5ae3b (2026-11-17)

The actual attached artifact for the correctly stamped source revision included a `NATIVE_WEBVIEW2_SMOKE.txt` report reporting **NOT VERIFIED**, with `The "paths[2]" argument must be of type string. Received an instance of Array`. This was caused by `array.map(resolve)`: JavaScript's `Array.map` passes index and the original array to Node's `path.resolve`, causing it to reject the array. The native probe is corrected to explicitly invoke `resolve(candidate)` and has a regression test. This is a CI test harness bug; it does not imply that the installed blank-screen issue has been cured. Only a new native probe result and Windows 11 user QA can validate that.

## Native runtime CI WebView2 debugging restriction (2026-11-17)

The exact-commit Windows trial in run 44068827788 compiled, but its native probe returned NOT VERIFIED: No inspectable WebView2 page in the Windows CI session. WebView2 150+ on elevated Windows runners can ignore environment-provided CDP debugging ports (MicrosoftEdge/WebView2Feedback#5645). Do not weaken system policies or enable production debugging to bypass this safeguard.

The native CI probe now attempts a read-only Windows UI Automation accessibility check on the launched local process if CDP cannot attach. It looks for the MeTodo window and its visible Home heading, without examining task content. If neither method verifies the visible heading, the Windows workflow reports failure but still uploads the checksum-verified unsigned diagnostic installer when compilation succeeded. A successful workflow never substitutes for a full installed Windows 11 functional acceptance test.

## Native window exists but UI header is missing from accessibility tree (2026-11-17)

Run 44071057420 was correctly marked **failure** at the native screen gate, although the installer and SHA256SUMS were still uploaded. Its UI Automation fallback confirmed a real native window but could not locate a visible `Stay productive` heading. This is consistent with the reported blank-body problem, but does not prove that the heading is actually missing because WebView2 UIA exposure can vary. To distinguish those cases, the next native smoke test records the existence (not text content) of only known static tab labels and a WebView2 document accessibility node, plus window bounds. If the header remains unavailable, it also attempts to capture a PNG of the *fresh ephemeral GitHub Actions test window only*, using Windows GDI. This image must not be generated against users' existing profile data or used as evidence of persistent task privacy. A missing or blank screenshot must be treated as diagnostic uncertainty, not a confirmed app defect.

## Native blank screen reproduced visually, with root geometry capture (2026-11-17)

Run 44072666261 produced an ephemeral native screenshot showing the same failure as the owner reported: MeTodo title and Home/Tasks/Avatar/Settings labels across the top, with no visible main screen content. The accessibility probe confirms a live window (1044x788) with a WebView2 document control and Tasks/Settings labels, but no visible Home heading. Screenshot and sanitized native report were saved in the CI trial artifact; this is a confirmed native rendering defect, not just CDP automation failure.

The Windows-only diagnostic bootstrap now **always opens** its temporary panel after startup and reports root/body/child geometry, known static Home header coordinates and parent flex/overflow values, stylesheet counts and resource error counts. It never displays private tasks or sends diagnostic data off-device. The same panel may cover part of the screen during testing but is dismissible. Do not propagate this forced diagnostics behavior into a stable installer; it exists solely to identify the missing content layer.

## Native DOM paint diagnosis from run 44074757159 (2026-11-17)

The forced geometry panel on the actual Windows build confirms: body/root/root-child measure 1028x749; NativeWind CSS is present (3 stylesheets, 1/1 external CSS loaded); Home heading text exists in the DOM with a visible-sized 115x20 bounding box near x=16, y=52; yet the screenshot shows no readable Home content. This rules out the earlier hypothesis that the root or Home heading is absent/zero height. It does **not** yet distinguish white-on-white colors from screen ancestor opacity, clipping or another overlay. The next Windows-only diagnostic adds computed foreground/background theme tokens, actual heading color/opacity, ancestor paint styles and a pixel-position hit-test without capturing task names. No stable release is permitted until the underlying visible paint failure is corrected and tested.

## Windows paint diagnostics exported to CI without DevTools (2026-11-17)

When the native window contains the Home heading in the DOM but its text is not painted, the diagnostics panel now exposes a strictly whitelisted, technical `METODO-PAINT` summary through an accessible button. The Windows CI runner can record computed heading foreground color, effective ancestor opacity, whether an element covers the heading's hit-test point, and heading geometry from its fresh test profile. No private tasks, content, URLs, account data or storage are read, and debugging ports remain unnecessary. Read the `UIA.paintSummary` field in `NATIVE_WEBVIEW2_SMOKE.txt`. If the accessibility provider cannot expose the technical button, this field remains `unavailable` and native QA still fails.

## Failed transition experiment and revised native paint diagnosis (2026-11-17)

Run 44082695935 showed that disabling Stack/tab transitions only inside the Tauri origin did **not** change the native failure: the Home heading remained a nonzero DOM rectangle with readable gray text, full opacity and no hit-test overlay, while its visible accessibility check failed. The unsuccessful experiment was reverted, restoring the exact pre-experiment source tree.

The diagnostic now measures computed WebKit text-fill color, ancestor clip/mask, and counts of opaque sibling backgrounds overlapping the heading point, including `pointer-events:none` layers that ordinary DOM hit testing ignores. It exposes only fixed technical paint metrics through a CI-only accessible button. Check `UIA.layerSummary` in the native smoke log, alongside `UIA.paintSummary`. Do not publish a stable Windows build without a visible native screen and functional Windows 11 verification.

## Experimental Windows-only collapsed scene repair (2026-11-17)

The latest native screenshot shows the Home heading exists and is styled with a nontransparent foreground, opacity 1, no masking, and no obvious overlay; however one of the heading's wrapper ancestors has a *zero-height clipping box* while its parent is tall. That is a more concrete cause than the original root-height hypothesis. A narrow trial-only bootstrap now scans only ancestors of the static `Stay productive` Home heading and restores height only for a full-width 0px clipping wrapper whose parent is at least 250px tall. It records `METODO-SCENE` before/after measurements for UI Automation and captures a fresh CI screenshot regardless of PASS/FAIL. This is not yet a permanent general-purpose CSS fix: a successful trial must confirm natural navigation behavior, scrollability, tab changes, task CRUD and backup/restore before moving the repair into maintainable app layout code. It never reads or writes task storage. Stable Windows release remains blocked.

## Corrected multi-layer native scene repair experiment (2026-11-17)

Build 10de76c4c270 did not activate the previous clipped-container repair: `METODO-SCENE repairs=0 before=not_checked after=no_change` despite native window still blank. The first experiment incorrectly required the zero-height node's **immediate parent** to have positive height. On the observed nested React Navigation scene, multiple consecutive ancestors can have 0px height, so that condition was too strict. A revised Windows-only test traces only the static Home heading's ancestor chain into a sanitized `METODO-CHAIN` UI Automation field and repairs the **outermost collapsed ancestor first**, taking available height from the nearest positive-height ancestor rather than the immediate parent. The script still does not inspect task text or persistence and remains an unsigned diagnostic trial, not a Windows release fix until native screenshot and app workflows pass.

## Home screen successfully rendered; tab work-area qualification (2026-11-17)

The revised multi-layer height repair passed actual Windows UI Automation in run [44096969705](https://github.com/sanskarIN/MeTodo/actions/runs/44096969705), with `METODO-SCENE repairs=2` and a screenshot showing the real Home dashboard, task counters, search, empty state and create-task button. This is the first verified native Home rendering in the test series, and the earlier blank-body failure is reproducibly overcome. **Do not equate this with complete native Windows support.** The first screenshot had the native window extending below a 768p CI desktop's Windows taskbar, with tab navigation not clearly visible. Tauri's default 770px client height was too large for the CI screen's work area. A compact, centered, resizable 980x640 startup window now fits lower-height desktops. CI's read-only accessibility probe explicitly requires Tasks and Settings tab labels to be on-screen within the Windows **working area** (not merely within the hidden bottom of an oversized app window). Any inaccessible tabs now fail the native Windows release gate even if Home renders.

## Native tab navigation functional smoke (2026-11-17)

The compact 980x640 Windows trial and UI Automation test passed in [run 44099409493](https://github.com/sanskarIN/MeTodo/actions/runs/44099409493). It confirmed Home plus visible Tasks/Settings labels completely within the CI desktop work area. The screenshot also shows the bottom tab bar. That is stronger than the earlier green Home-only probe, but it does not prove that the tabs respond to clicks. The next native smoke extension performs a fixed-label Tasks → Settings → Home roundtrip on a disposable GitHub Actions Windows profile, using the tab coordinates from UI Automation. It verifies only public static headings: `Manage your tasks`, `Customize your experience` and `Stay productive`. No user task content is read or written. A failed roundtrip correctly blocks a green Windows CI result while preserving the unsigned diagnostic installer.

## Native Create Task route smoke (2026-11-17)

Windows run 44101872443 passed the real Tasks → Settings → Home mouse-click roundtrip with three visible headings, after successfully rendering Home and both bottom navigation tabs on the compact desktop. The next native CI gate clicks the existing Home `+ Create New Task` control and verifies that the `Create Task` screen is visibly accessible in the real WebView2 process. This verifies routing only: it does **not** create or persist tasks, change settings, perform backups, or claim complete Windows 11 functionality. The interaction runs solely against a disposable GitHub Actions profile and the test report includes only fixed technical booleans, never task content.


## Native window resize regression gate (18 November 2026)

The Windows UI Automation smoke now attempts a controlled native `MoveWindow`
resize of the compiled Tauri application on the disposable GitHub Actions
Windows profile **before** clicking Tasks, Settings, Home and Create Task.
It records only technical booleans and window dimensions:
`resizeAttempted`, `resizeWindowChanged`, `resizeHomeVisible`,
`resizeTabsVisible`, `resizedWidth`, and `resizedHeight`.
A PASS via the UI Automation fallback requires these resize checks and
the route navigation checks to succeed. The test does not create private tasks.
The CDP-only path still validates its own narrower renderer metrics; its
success must not be interpreted as a completed resize/CRUD acceptance test.

This remains an unsigned diagnostic build. Real Windows 11 installation,
task CRUD, backup/restore, close/reopen persistence and offline operation
must be checked independently. The production-dependency security audit is
still blocking regardless of whether a diagnostic installer was uploaded.


## Native synthetic task creation gate (18 November 2026)

After verifying the native Windows resize and route navigation, GitHub Actions
uses a **disposable CI-only WebView2 profile** to enter the fixed, nonpersonal
title `MeTodo CI Smoke Task` into the task title field and click the accessible
Save new task button. It checks that the app returns Home and that the
synthetic task is visible on the Tasks screen. No task names are copied into
CI reports; the result is recorded as fixed boolean fields. This is an
actual UI-to-persistence-write smoke, but it does not yet prove durability
after process restart, backup/restore, or the full CRUD sequence.

The probe is gated by `GITHUB_ACTIONS=true`; do not run it against a user's
existing profile. The native screenshot is captured **before** synthetic task
creation and never captures user data. The Windows trial remains unsigned and
the production audit remains a blocking failure until fixed upstream.
