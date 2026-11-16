import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("Desktop/web viewport and screen sizing contract", () => {
  const css = fs.readFileSync("global.css", "utf8");
  const screen = fs.readFileSync("components/screen-container.tsx", "utf8");

  it("always sizes the Expo root relative to the viewport", () => {
    expect(css).toMatch(/html,\s*body\s*\{[^}]*height:\s*100%/s);
    expect(css).toMatch(/body\s*\{[^}]*display:\s*flex/s);
    expect(css).toMatch(/#root\s*\{[^}]*height:\s*100%/s);
    expect(css).toMatch(/#root\s*\{[^}]*min-height:\s*0/s);
  });

  it("does not depend solely on NativeWind classes to size web safe-area views", () => {
    expect(screen).toContain("style={{ flex: 1, minHeight: 0 }}");
    expect(screen).toContain("style={[{ flex: 1, minHeight: 0 }, style]}");
    expect(screen).toContain('className={cn("flex-1", className)}');
  });
});
