import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
describe("Windows blank-screen diagnostics", () => {
  const bootstrap = readFileSync("scripts/windows-diagnostic-bootstrap.js", "utf8");
  const exporter = readFileSync("scripts/prepare-windows-export.mjs", "utf8");
  it("contains a build marker and a failure panel", () => {
    expect(bootstrap).toContain("data-metodo-build-badge");
    expect(bootstrap).toContain("Any known screen content");
    expect(bootstrap).toContain("External CSS loaded");
    expect(bootstrap).toContain("Home ancestors:");
    expect(bootstrap).toContain("Home paint check:");
    expect(bootstrap).toContain("Foreground token");
    expect(bootstrap).toContain("effective opacity");
    expect(bootstrap).toContain("elementFromPoint");
    expect(bootstrap).toContain("METODO-PAINT ");
    expect(bootstrap).toContain("data-metodo-paint-summary");
    expect(bootstrap).toContain("alpha.toFixed(3)");
    expect(bootstrap).toContain("METODO-LAYER ");
    expect(bootstrap).toContain("data-metodo-layer-summary");
    expect(bootstrap).toContain("webkitTextFillColor");
    expect(bootstrap).toContain("showPanel(!hasContent())");
    expect(bootstrap).toContain("Reload UI (keeps tasks)");
    expect(exporter).toContain('metodo-desktop-diagnostic');
    expect(exporter).toContain("listHtml(destination)");
  });
  it("never reads or wipes private local tasks", () => {
    expect(bootstrap).not.toMatch(/localStorage|AsyncStorage|metodo_tasks|removeItem|sendBeacon|fetch\(/);
    expect(bootstrap).not.toMatch(/location\.replace|sessionStorage/);
  });
  it("parses both new scripts as actual JavaScript", () => {
    expect(() => execFileSync(process.execPath, ["--check", "scripts/windows-diagnostic-bootstrap.js"])).not.toThrow();
    expect(() => execFileSync(process.execPath, ["--check", "scripts/prepare-windows-export.mjs"])).not.toThrow();
  });
});
