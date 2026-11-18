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

let ws;
try {
  if (process.platform !== "win32") throw new Error("Windows-only native renderer test");
  const exe = [
    "src-tauri/target/release/metodo-desktop.exe",
    "src-tauri/target/release/MeTodo.exe"
  ].map(candidate => resolve(candidate)).find(candidate => existsSync(candidate));
  if (!exe) {
    const folder = resolve("src-tauri/target/release");
    const names = existsSync(folder) ? readdirSync(folder).filter(name => name.endsWith(".exe")) : [];
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
  const page = await target();
  ws = await connect(page.webSocketDebuggerUrl);
  let metrics;
  for (let i = 0; i < 12; i++) {
    metrics = await evaluate(ws, expression);
    if (metrics?.headerVisible && metrics.rootHeight >= 300 && metrics.badge) break;
    await sleep(1200);
  }
  const pass = Boolean(metrics?.headerVisible && metrics.rootHeight >= 300 && metrics.badge);
  const report = "Native Windows WebView2 test: " + (pass ? "PASS" : "FAIL") + "\n" +
    JSON.stringify(metrics, null, 2) + "\n";
  writeFileSync(output, report, "utf8");
  console.log(report);
  if (!pass) process.exitCode = 1;
} catch (error) {
  let uia = { method: "Windows UI Automation", status: "NOT VERIFIED", reason: "not_run" };
  if (child?.pid && child.exitCode === null) {
    try {
      const args = [
        "-NoProfile", "-NonInteractive",
        "-File", resolve("scripts/windows-native-uia-probe.ps1"),
        "-TargetProcessId", String(child.pid),
      ];
      if (process.env.GITHUB_ACTIONS === "true") {
        args.push("-ScreenshotPath", resolve(folder, "WINDOWS_TRIAL_RENDER.png"));
      }
      const json = execFileSync("powershell.exe", args, {
        encoding: "utf8", windowsHide: true, timeout: uiaTimeoutMs,
        maxBuffer: 512 * 1024,
      }).trim();
      uia = JSON.parse(json);
    } catch (probeError) {
      // Never log subprocess output, local paths, or task data.
      const cause = probeError?.code === "ETIMEDOUT"
        ? "uia_probe_timed_out"
        : probeError instanceof SyntaxError
          ? "uia_probe_invalid_json"
          : "uia_probe_script_failed";
      uia = { method: "Windows UI Automation", status: "NOT VERIFIED",
        reason: cause };
    }
  }
  const passed = uia?.status === "PASS" && uia?.windowFound === true &&
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
  const report = "Native Windows WebView2 test: " +
    (passed ? "PASS (Windows UI Automation fallback)" : "NOT VERIFIED") + "\n" +
    "CDP: " + String(error?.message || error) + "\n" +
    "UIA: " + JSON.stringify(uia) + "\n";
  writeFileSync(output, report, "utf8");
  if (passed) console.log(report);
  else { console.error(report); process.exitCode = 1; }
} finally {
  if (ws) ws.close();
  if (child?.pid) spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true });
}
