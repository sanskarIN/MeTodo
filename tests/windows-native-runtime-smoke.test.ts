import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { runInNewContext } from "node:vm";
describe("Windows native runtime verification", () => {
  const probe = readFileSync("scripts/windows-native-webview2-smoke.mjs", "utf8");
  const workflow = readFileSync(".github/workflows/windows-native.yml", "utf8");
  it("probes the compiled Tauri executable using actual WebView2 DevTools protocol", () => {
    expect(probe).toContain("metodo-desktop.exe");
    expect(probe).toContain("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS");
    expect(probe).toContain("Runtime.evaluate");
    expect(probe).toContain("headerVisible");
    expect(workflow).toContain("node scripts/windows-native-webview2-smoke.mjs");
  });
  it("resolves executable paths without passing Array.map callback metadata to path.resolve", () => {
    // Array.map passes (value, index, array): forwarding all three to
    // node:path.resolve throws because the third argument is an array.
    expect(probe).toContain(".map(candidate => resolve(candidate))");
    expect(probe).not.toContain(".map(resolve)");
    const candidates = ["src-tauri/target/release/metodo-desktop.exe", "src-tauri/target/release/MeTodo.exe"];
    expect(candidates.map(candidate => candidate.length)).toHaveLength(2);
  });

  it("does not access task data or storage in the probe", () => {
    expect(probe).not.toMatch(/localStorage|AsyncStorage|metodo_tasks|metodo_settings/);
    expect(probe).not.toMatch(/window\.localStorage|sessionStorage|sendBeacon/);
  });
  it("uses exact source commit provenance and always uploads a sanitized result", () => {
    const exporter = readFileSync("scripts/prepare-windows-export.mjs", "utf8");
    expect(workflow).toContain("METODO_SOURCE_SHA: ${{ github.event.pull_request.head.sha || github.sha }}");
    expect(workflow).toContain("ref: ${{ github.event.pull_request.head.sha || github.sha }}");
    expect(workflow).toContain("$env:METODO_SOURCE_SHA.Substring(0, 12)");
    expect(workflow).toContain("Probe terminated before writing diagnostics");
    expect(exporter).toContain("process.env.METODO_SOURCE_SHA");
    expect(exporter).toContain("Windows trial source revision differs from checked-out code");
  });
  it("falls back to Windows accessibility without reading private task data", () => {
    const uia = readFileSync("scripts/windows-native-uia-probe.ps1", "utf8");
    expect(probe).toContain("windows-native-uia-probe.ps1");
    expect(probe).toContain("PASS (native UIA and restart persistence required)");
    expect(uia).toContain("System.Windows.Automation.AutomationElement");
    expect(uia).toContain('diagnosticBadgeInvoked');
    expect(uia).toContain('diagnosticsPanelClosed');
    expect(uia).toContain('EndsWith("diagnostics")');
    expect(uia).toContain('[System.Windows.Automation.InvokePattern]::Pattern');
    expect(uia).toContain("Stay productive");
    expect(uia).toContain("homeHeaderVisible");
    expect(uia).toContain("tasksTabVisible");
    expect(uia).toContain("settingsTabVisible");
    expect(uia).toContain("desktopWorkAreaBottom");
    expect(uia).toContain("native_resize_navigation_and_synthetic_task_saved");
    expect(uia).toContain('syntheticTaskVisibleInTasks');
    expect(uia).toContain('MeTodo CI Smoke Task');
    expect(uia).toContain('accessibility provider');
    expect(probe).toContain('uia?.syntheticTaskSaveClicked === true');
    expect(probe).toContain('uia?.syntheticTaskVisibleInTasks === true');
    expect(uia).toContain("MoveWindow(");
    expect(probe).toContain("const uiaTimeoutMs = 180000");
    expect(probe).toContain("timeout: uiaTimeoutMs");
    expect(probe).toContain('"uia_probe_timed_out"');
    expect(probe).toContain('"uia_probe_script_failed"');
    expect(uia).toContain('phase="synthetic_save_result"');
    expect(uia).toContain("syntheticTaskInputClickSafe");
    expect(uia).toContain("syntheticTaskSaveClickSafe");
    expect(uia).toContain("syntheticTaskInputValueMatched");
    expect(uia).toContain("synthetic_task_input_text_not_received");
    expect(uia).toContain("synthetic_save_control_obscured");
    expect(uia).toContain("$inputBounds.Left+[Math]::Min(24,$inputBounds.Width/8)");
    expect(uia).toContain("$saveBounds.Left+[Math]::Min(24,$saveBounds.Width/8)");
    expect(probe).toContain("uia?.syntheticTaskInputClickSafe === true");
    expect(probe).toContain("uia?.syntheticTaskSaveClickSafe === true");
    expect(uia).toContain('phase="complete"');
    expect(uia).toContain("resizeAttempted");
    expect(uia).toContain("resizeWindowChanged");
    expect(uia).toContain("resizeHomeVisible");
    expect(uia).toContain("resizeTabsVisible");
    expect(uia).toContain('StaticHeadingVisible "Stay productive"');
    expect(probe).toContain("uia?.resizeWindowChanged === true");
    expect(probe).toContain("uia?.resizeHomeVisible === true");
    expect(probe).toContain("uia?.resizeTabsVisible === true");
    expect(uia).toContain("navigationAttempted");
    expect(uia).toContain("tasksScreenVisible");
    expect(uia).toContain("settingsScreenVisible");
    expect(uia).toContain("homeRoundtripVisible");
    expect(uia).toContain("createEntryVisible");
    expect(uia).toContain("createScreenVisible");
    expect(uia).toContain("+ Create New Task");
    expect(uia).toContain("Click-CITab");
    expect(uia).toContain('StaticHeadingVisible "Manage your tasks"');
    expect(uia).toContain('StaticHeadingVisible "Customize your experience"');
    expect(uia).toContain("sceneSummary");
    expect(uia).toContain("chainSummary");
    expect(uia).toContain("METODO-CHAIN ");
    expect(uia).toContain("METODO-SCENE ");
    expect(uia).toContain("homeTabFound");
    expect(uia).toContain("documentControlPresent");
    expect(uia).toContain("GITHUB_ACTIONS");
    expect(probe).toContain("WINDOWS_TRIAL_RENDER.png");
    expect(uia).toContain("METODO-PAINT ");
    expect(uia).toContain("paintSummary");
    expect(uia).toContain("METODO-LAYER ");
    expect(uia).toContain("layerSummary");
    expect(uia).not.toMatch(/localStorage|AsyncStorage|metodo_tasks|Get-Content/);
  });
  it("uses accessible, fixed-input labels for the Windows synthetic task smoke", () => {
    const create = readFileSync("app/create-task.tsx", "utf8");
    expect(create).toContain('accessibilityLabel="Task title"');
    expect(create).toContain('accessibilityLabel="Save new task"');
    expect(create).toContain('accessibilityRole="button"');
  });
  it("keeps diagnostics downloadable even when native verification fails", () => {
    expect(workflow).not.toContain("continue-on-error: true");
    expect(workflow).toContain("always() && steps.build_native.outcome == 'success'");
    expect(workflow).toContain("always() && steps.checksums.outcome == 'success'");
    expect(workflow).toContain("NATIVE_WEBVIEW2_SMOKE.txt");
    expect(workflow).toContain("Security audit (blocking, after diagnostic artifact)");
    expect(workflow).toContain("SECURITY AUDIT BLOCKED:");
    expect(workflow.indexOf("pnpm audit --prod --audit-level high")).toBeGreaterThan(
      workflow.indexOf("Upload trial installer without publishing")
    );
  });

  it("cannot bypass required native UIA checks with a healthy CDP Home screen", () => {
    expect(probe).toContain('process.env.GITHUB_ACTIONS !== "true"');
    expect(probe).toContain("const passed = nativeUiaPasses(uia) && nativeRestartPasses(restart);");
    expect(probe).toContain('cdp = { status: ready ? "PASS" : "NOT VERIFIED", metrics };');
    expect(probe).not.toMatch(/const pass = Boolean\(metrics\?\./);
    expect(probe.indexOf("const passed = nativeUiaPasses(uia) && nativeRestartPasses(restart);")).toBeGreaterThan(
      probe.indexOf("uia = JSON.parse(json);")
    );

    // Run the actual pure release-gate predicate against synthetic CI results,
    // rather than creating a second, weaker implementation in this test.
    const gate = probe.match(/function nativeUiaPasses\(uia\) \{[\s\S]*?\n\}/)?.[0];
    expect(gate).toBeTruthy();
    const verify = (uia: unknown): boolean => Boolean(runInNewContext(
      (gate ?? "") + "\nnativeUiaPasses(uia);", { uia },
    ));
    const required = [
      "windowFound", "homeHeaderVisible", "resizeAttempted",
      "resizeWindowChanged", "resizeHomeVisible", "resizeTabsVisible",
      "tasksScreenVisible", "settingsScreenVisible", "createScreenVisible",
      "syntheticTaskTyped", "syntheticTaskInputClickSafe",
      "syntheticTaskSaveClickSafe", "syntheticTaskSaveClicked",
      "syntheticTaskReturnedHome", "syntheticTaskVisibleInTasks",
    ];
    const good: Record<string, string | boolean> = {
      status: "PASS",
      ...Object.fromEntries(required.map(key => [key, true])),
    };
    expect(verify(good)).toBe(true);
    expect(verify({ ...good, status: "NOT VERIFIED" })).toBe(false);
    for (const missing of required) {
      expect(verify({ ...good, [missing]: false })).toBe(false);
      expect(verify({ ...good, [missing]: undefined })).toBe(false);
    }
    // A clean CDP result has no way to override failed task persistence or UIA.
    expect(verify({ status: "NOT VERIFIED", cdp: { status: "PASS" } })).toBe(false);
  });

  it("requires a new native process to find the saved synthetic task after a restart", () => {
    const second = readFileSync("scripts/windows-native-restart-persistence.ps1", "utf8");
    expect(workflow).toContain('"scripts/windows-native-restart-persistence.ps1"');
    expect(probe).toContain('resolve("scripts/windows-native-restart-persistence.ps1")');
    // Both native launches must open the exact same WebView2 profile settings.
    // Do not mistake a new or incompatible profile for lost task persistence.
    expect(probe).toContain("const ciWebviewBrowserArgs =");
    expect(probe.match(/WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS:\s*ciWebviewBrowserArgs/g)).toHaveLength(2);
    expect(probe).not.toContain('WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: ""');
    expect(probe).toContain('$target.CloseMainWindow()');
    expect(probe).toContain('$target.WaitForExit(15000)');
    expect(probe).toContain('"graceful_window_close_not_verified"');
    expect(probe).toContain("child.pid === initialPid");
    expect(probe).toContain("const passed = nativeUiaPasses(uia) && nativeRestartPasses(restart);");
    expect(probe).toContain('"RESTART: " + JSON.stringify(restart)');
    expect(second).toContain('$env:GITHUB_ACTIONS -ne "true"');
    expect(second).toContain("Get-Process -Id $TargetProcessId");
    expect(second).toContain('Get-CIVisibleLabel "Stay productive"');
    expect(second).toContain('Get-CIVisibleLabel "Manage your tasks"');
    expect(second).toContain('"MeTodo CI Smoke Task"');
    expect(second).toContain('$r.syntheticTaskFoundInTreeAfterRestart=$true');
    expect(second).toContain("syntheticTaskInViewportAfterRestart");
    expect(second).toContain("emptyTasksMessageAfterRestart");
    expect(second).toContain("savedTasksErrorAfterRestart");
    expect(second).toContain('$r.syntheticTaskPersistedAfterRestart=(');
    expect(second).not.toMatch(/localStorage|AsyncStorage|metodo_tasks|metodo_settings|Get-Content|Remove-Item/);

    const gate = probe.match(/function nativeRestartPasses\(restart\) \{[\s\S]*?\n\}/)?.[0];
    expect(gate).toBeTruthy();
    const verify = (restart: unknown): boolean => Boolean(runInNewContext(
      (gate ?? "") + "\nnativeRestartPasses(restart);", { restart },
    ));
    const required = [
      "windowFoundAfterRestart", "homeVisibleAfterRestart",
      "tasksTabVisibleAfterRestart", "tasksScreenVisibleAfterRestart",
      "syntheticTaskPersistedAfterRestart"
    ];
    const good: Record<string, string | boolean> = {
      status: "PASS", ...Object.fromEntries(required.map(key => [key, true]))
    };
    expect(verify(good)).toBe(true);
    expect(verify({ ...good, status: "NOT VERIFIED" })).toBe(false);
    for (const missing of required) {
      expect(verify({ ...good, [missing]: false })).toBe(false);
      expect(verify({ ...good, [missing]: undefined })).toBe(false);
    }
    expect(verify({ status: "PASS", homeVisibleAfterRestart: true })).toBe(false);
  });

  it("is syntactically valid in Node", () => {
    expect(() => execFileSync(process.execPath, ["--check", "scripts/windows-native-webview2-smoke.mjs"])).not.toThrow();
  });
});
