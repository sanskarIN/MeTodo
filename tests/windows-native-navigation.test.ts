import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("Windows-only route transition mitigation", () => {
  const helper = fs.readFileSync("lib/windows-desktop.ts", "utf8");
  const root = fs.readFileSync("app/_layout.tsx", "utf8");
  const tabs = fs.readFileSync("app/(tabs)/_layout.tsx", "utf8");
  it("only opts into transition suppression on the packaged Tauri origin", () => {
    expect(helper).toContain('window.location.hostname.toLowerCase() === "tauri.localhost"');
    expect(helper).toContain('typeof window !== "undefined"');
    expect(root).toContain('screenOptions={isWindowsDesktopRuntime() ? { animation: "none" } : undefined}');
    expect(tabs).toContain('animation: isWindowsDesktopRuntime() ? "none" : undefined');
  });
  it("leaves existing web and mobile navigation options intact", () => {
    expect(tabs).toContain("tabBarButton: HapticTab");
    expect(tabs).toContain("backgroundColor: colors.background");
    expect(root).toContain("<GestureHandlerRootView");
    expect(root).toContain("<TaskProvider>");
  });
});
