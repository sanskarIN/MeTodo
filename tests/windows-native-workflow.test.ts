import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("MeTodo Windows builds a native installer rather than a web-only bundle", () => {
  const config = JSON.parse(fs.readFileSync("src-tauri/tauri.conf.json", "utf8"));
  const cargo = fs.readFileSync("src-tauri/Cargo.toml", "utf8");
  const workflow = fs.readFileSync(".github/workflows/windows-native.yml", "utf8");
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

  it("uses bundled Expo assets and an actual NSIS installer", () => {
    expect(config.build.frontendDist).toBe("../dist/windows-web");
    expect(config.build.devUrl).toBeUndefined();
    expect(config.bundle.active).toBe(true);
    expect(config.bundle.targets).toContain("nsis");
    expect(config.bundle.icon).toContain("icons/icon.ico");
    expect(config.bundle.windows.webviewInstallMode.type).toBe("offlineInstaller");
    expect(config.app.security.csp).toContain("object-src 'none'");
    expect(cargo).toContain('tauri = { version = "=2.12.3"');
  });

  it("exports web then generates brand icons before invoking the native compiler", () => {
    expect(pkg.scripts["desktop:windows:export"]).toContain("expo export --platform web");
    expect(pkg.scripts["desktop:windows:icon"]).toContain("assets/images/icon.png");
    expect(pkg.scripts["desktop:windows:build"]).toContain("desktop:windows:export");
    expect(pkg.scripts["desktop:windows:build"]).toContain("desktop:windows:icon");
    expect(pkg.scripts["desktop:windows:build"]).toContain("--bundles nsis");
  });

  it("never publishes an untested or unsigned Windows build", () => {
    expect(workflow).toContain("runs-on: windows-latest");
    expect(workflow).toContain("Build Windows NSIS installer");
    expect(workflow).toContain("Get-AuthenticodeSignature");
    expect(workflow).toContain("Get-FileHash");
    expect(workflow).toContain("metodo-windows-native-trial");
    expect(workflow).toContain("pnpm install --frozen-lockfile");
    expect(workflow).toContain("pnpm audit --prod --audit-level high");
    expect(workflow).not.toContain("action-gh-release");
    expect(workflow).not.toContain("contents: write");
    expect(workflow).not.toContain("tag_name:");
  });
});
