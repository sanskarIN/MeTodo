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
