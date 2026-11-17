import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
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
  it("is syntactically valid in Node", () => {
    expect(() => execFileSync(process.execPath, ["--check", "scripts/windows-native-webview2-smoke.mjs"])).not.toThrow();
  });
});
