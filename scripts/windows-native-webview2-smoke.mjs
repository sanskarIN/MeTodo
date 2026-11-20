/**
 * Advisory native Windows WebView2 smoke test (Node 22+).
 * Runs the actual compiled Tauri executable, not an HTTP Edge export.
 * Uses a localhost-only DevTools port on the ephemeral CI runner.
 * Never reads or uploads local task data.
 */
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const folder = resolve("dist/windows-native");
mkdirSync(folder, { recursive: true });
const output = resolve(folder, "NATIVE_WEBVIEW2_SMOKE.txt");
const port = 17773;
// Native UI Automation now verifies resize, navigation, and synthetic writes.
const uiaTimeoutMs = 180000;
let child;
async function target() {
  for (let i = 0; i < 45; i++) {
    if (child.exitCode !== null) throw new Error("Tauri exited before WebView2 was ready");
    try {
      const response = await fetch("http://127.0.0.1:" + port + "/json/list",
        { signal: AbortSignal.timeout(1300) });
      if (response.ok) {
        const pages = await response.json();
        const page = pages.find(p => p.type === "page" && p.webSocketDebuggerUrl &&
          !String(p.url).startsWith("devtools://"));
        if (page) return page;
      }
    } catch { /* WebView2 process is not ready yet */ }
    await sleep(850);
  }
  throw new Error("No inspectable WebView2 page in the Windows CI session");
}
async function connect(url) {
  return new Promise((yes, no) => {
    const ws = new WebSocket(url);
    const timer = setTimeout(() => { ws.close(); no(new Error("CDP connection timeout")); }, 10000);
    ws.addEventListener("open", () => { clearTimeout(timer); yes(ws); }, { once: true });
    ws.addEventListener("error", () => { clearTimeout(timer); no(new Error("CDP connection failed")); }, { once: true });
  });
}
let nextId = 0;
async function evaluate(ws, expression) {
  return new Promise((yes, no) => {
    const id = ++nextId;
    const timer = setTimeout(() => {
      ws.removeEventListener("message", handler);
      no(new Error("WebView2 evaluation timeout"));
    }, 8000);
    function handler(e) {
      let msg;
      try { msg = JSON.parse(e.data); } catch { return; }
      if (msg.id !== id) return;
      clearTimeout(timer);
      ws.removeEventListener("message", handler);
      if (msg.error || msg.result?.exceptionDetails) no(new Error("WebView2 renderer evaluation failed"));
      else yes(msg.result?.result?.value);
    }
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id, method: "Runtime.evaluate",
      params: { expression, returnByValue: true } }));
  });
}
const expression = [
  "(() => {",
  "const root=document.getElementById('root');",
  "const r=root&&root.getBoundingClientRect();",
  "const header=Array.from(document.querySelectorAll('h1,h2,h3,p,span,div')).find(",
  "e=>e.childElementCount===0&&(e.textContent||'').trim()==='Stay productive');",
  "const h=header&&header.getBoundingClientRect();",
  "return {ready:document.readyState,",
  "build:document.documentElement.getAttribute('data-metodo-windows-trial'),",
  "badge:!!document.querySelector('[data-metodo-build-badge]'),",
  "rootWidth:r?Math.round(r.width):0,rootHeight:r?Math.round(r.height):0,",
  "headerVisible:!!(h&&h.width>20&&h.height>8&&h.top<innerHeight&&h.bottom>0)};",
  "})()"
].join("");

/**
 * Only Windows UI Automation proves actual native navigation and task writes.
 * CDP is useful renderer diagnostics, but a healthy Home heading alone is
 * never sufficient to pass the trial build's functional release gate.
 */
function nativeUiaPasses(uia) {
  return uia?.status === "PASS" && uia?.windowFound === true &&
    uia?.homeHeaderVisible === true && uia?.resizeAttempted === true &&
    uia?.resizeWindowChanged === true && uia?.resizeHomeVisible === true &&
    uia?.resizeTabsVisible === true && uia?.tasksScreenVisible === true &&
    uia?.settingsScreenVisible === true && uia?.createScreenVisible === true &&
    uia?.syntheticTaskTyped === true &&
    uia?.syntheticTaskInputClickSafe === true &&
    uia?.syntheticTaskSaveClickSafe === true &&
    uia?.syntheticTaskSaveClicked === true &&
    uia?.syntheticTaskReturnedHome === true &&
    uia?.syntheticTaskVisibleInTasks === true;
}

/**
 * A fresh process must independently observe the fixed test task that the
 * first instance saved. Home-only success is never proof of persistence.
 */
function nativeRestartPasses(restart) {
  return restart?.status === "PASS" &&
    restart?.windowFoundAfterRestart === true &&
    restart?.homeVisibleAfterRestart === true &&
    restart?.tasksTabVisibleAfterRestart === true &&
    restart?.tasksScreenVisibleAfterRestart === true &&
    restart?.syntheticTaskPersistedAfterRestart === true;
}

let ws;
let cdp = { status: "NOT VERIFIED", reason: "not_started" };
let uia = { method: "Windows UI Automation", status: "NOT VERIFIED", reason: "not_run" };
try {
  // This smoke test creates a fixed synthetic task. Never run it against a
  // developer's existing profile or any machine outside disposable Windows CI.
  if (process.platform !== "win32" || process.env.GITHUB_ACTIONS !== "true") {
    throw new Error("Disposable Windows CI runner required");
  }
  const exe = [
    "src-tauri/target/release/metodo-desktop.exe",
    "src-tauri/target/release/MeTodo.exe"
  ].map(candidate => resolve(candidate)).find(candidate => existsSync(candidate));
  if (!exe) {
    const releaseDir = resolve("src-tauri/target/release");
    const names = existsSync(releaseDir) ?
      readdirSync(releaseDir).filter(name => name.endsWith(".exe")) : [];
    throw new Error("Compiled Tauri executable unavailable. Other EXEs: " + names.join(", "));
  }
  child = spawn(exe, [], {
    cwd: resolve("."), windowsHide: true, stdio: "ignore",
    env: {
      ...process.env,
      WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS:
        "--remote-debugging-address=127.0.0.1 --remote-debugging-port=" + port
    }
  });

  // Advisory CDP geometry check. Its success must not bypass navigation,
  // native resizing, or synthetic task-save verification by Windows UIA.
  try {
    const page = await target();
    ws = await connect(page.webSocketDebuggerUrl);
    let metrics;
    for (let i = 0; i < 12; i++) {
      metrics = await evaluate(ws, expression);
      if (metrics?.headerVisible && metrics.rootHeight >= 300 && metrics.badge) break;
      await sleep(1200);
    }
    const ready = Boolean(metrics?.headerVisible &&
      metrics.rootHeight >= 300 && metrics.badge);
    cdp = { status: ready ? "PASS" : "NOT VERIFIED", metrics };
  } catch {
    // Expected on some hosted Windows runner / WebView2 configurations.
    // Never log network responses, page URLs, or arbitrary exception strings.
    cdp = { status: "NOT VERIFIED", reason: "cdp_unavailable_or_unready" };
  } finally {
    if (ws) { ws.close(); ws = undefined; }
  }

  // Required functional gate. Always run even when the CDP renderer probe
  // succeeded; otherwise a working Home heading could mask broken task CRUD.
  if (child?.pid && child.exitCode === null) {
    try {
      const args = [
        "-NoProfile", "-NonInteractive",
        "-File", resolve("scripts/windows-native-uia-probe.ps1"),
        "-TargetProcessId", String(child.pid),
        "-ScreenshotPath", resolve(folder, "WINDOWS_TRIAL_RENDER.png"),
      ];
      const json = execFileSync("powershell.exe", args, {
        encoding: "utf8", windowsHide: true, timeout: uiaTimeoutMs,
        maxBuffer: 512 * 1024,
      }).trim();
      uia = JSON.parse(json);
    } catch (probeError) {
      const reason = probeError?.code === "ETIMEDOUT"
        ? "uia_probe_timed_out"
        : probeError instanceof SyntaxError
          ? "uia_probe_invalid_json"
          : "uia_probe_script_failed";
      uia = { method: "Windows UI Automation", status: "NOT VERIFIED", reason };
    }
  } else {
    uia.reason = "native_process_unavailable";
  }

  // Confirm that the saved task survives an actual native process restart.
  // Use the same Tauri/WebView2 app identity and CI profile; only the fixed
  // synthetic label may be queried by the follow-up accessibility probe.
  // Kill after the first UIA has observed the saved task, not before.
  let restart = {
    method: "Windows UI Automation restart persistence",
    status: "NOT VERIFIED", reason: "initial_native_functional_gate_failed"
  };
  if (nativeUiaPasses(uia)) {
    const initialPid = child?.pid;
    // Model a real user closing the app window. A forced taskkill can
    // terminate WebView2 before its local database has flushed to disk,
    // turning a normal-relaunch test into a crash-durability test.
    const stopped = initialPid && spawnSync(
      "powershell.exe",
      [
        "-NoProfile", "-NonInteractive", "-Command",
        "$target=[System.Diagnostics.Process]::GetProcessById(" +
          Number(initialPid) + ");" +
          "if (-not $target.CloseMainWindow()) {exit 2};" +
          "if (-not $target.WaitForExit(15000)) {exit 3}; exit 0"
      ],
      { windowsHide: true, timeout: 20000, stdio: "ignore" }
    );
    if (stopped?.status === 0) {
      child = undefined;
      // The app exits cleanly before the same WebView2 data is reopened.
      // Never clear storage, kill the profile or choose a new user-data folder.
      await sleep(1800);
      try {
        child = spawn(exe, [], {
          cwd: resolve("."), windowsHide: true, stdio: "ignore",
          env: { ...process.env, WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: "" }
        });
        if (!child.pid || child.pid === initialPid) {
          restart.reason = "relaunch_process_identity_not_verified";
        } else {
          const args = [
            "-NoProfile", "-NonInteractive",
            "-File", resolve("scripts/windows-native-restart-persistence.ps1"),
            "-TargetProcessId", String(child.pid)
          ];
          const json = execFileSync("powershell.exe", args, {
            encoding: "utf8", windowsHide: true, timeout: 75000,
            maxBuffer: 128 * 1024,
          }).trim();
          restart = JSON.parse(json);
        }
      } catch (restartError) {
        restart = {
          method: "Windows UI Automation restart persistence",
          status: "NOT VERIFIED",
          reason: restartError?.code === "ETIMEDOUT"
            ? "restart_probe_timed_out"
            : restartError instanceof SyntaxError
              ? "restart_probe_invalid_json"
              : "restart_probe_failed"
        };
      }
    } else {
      restart.reason = "graceful_window_close_not_verified";
    }
  }

  const passed = nativeUiaPasses(uia) && nativeRestartPasses(restart);
  const report = "Native Windows WebView2 test: " +
    (passed ? "PASS (native UIA and restart persistence required)" : "NOT VERIFIED") + "\n" +
    "CDP: " + JSON.stringify(cdp) + "\n" +
    "UIA: " + JSON.stringify(uia) + "\n" +
    "RESTART: " + JSON.stringify(restart) + "\n";
  writeFileSync(output, report, "utf8");
  if (passed) console.log(report);
  else { console.error(report); process.exitCode = 1; }
} catch {
  // Do not expose arbitrary launch errors or paths in uploaded diagnostics.
  const report = "Native Windows WebView2 test: NOT VERIFIED\n" +
    "Reason: native_startup_or_probe_unavailable\n";
  writeFileSync(output, report, "utf8");
  console.error(report);
  process.exitCode = 1;
} finally {
  if (ws) ws.close();
  if (child?.pid) {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"],
      { windowsHide: true });
  }
}
