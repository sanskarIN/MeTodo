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
  it("does not access task data or storage in the probe", () => {
    expect(probe).not.toMatch(/localStorage|AsyncStorage|metodo_tasks|metodo_settings/);
    expect(probe).not.toMatch(/window\.localStorage|sessionStorage|sendBeacon/);
  });
  it("is syntactically valid in Node", () => {
    expect(() => execFileSync(process.execPath, ["--check", "scripts/windows-native-webview2-smoke.mjs"])).not.toThrow();
  });
});
