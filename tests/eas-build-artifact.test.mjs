import { describe, expect, it } from "vitest";
import { selectBuild } from "../scripts/download-eas-android-build.mjs";

const good = {
  id: "eas-test-id",
  platform: "ANDROID",
  status: "FINISHED",
  buildProfile: "production-apk",
  artifacts: { buildUrl: "https://expo.dev/artifacts/example.apk" },
};

describe("EAS signed Android artifact metadata", () => {
  it("accepts only completed Android APK builds", () => {
    expect(selectBuild(JSON.stringify([good]))).toEqual({
      id: "eas-test-id",
      url: "https://expo.dev/artifacts/example.apk",
    });
  });

  it("rejects unfinished and failed builds", () => {
    for (const status of ["in-progress", "errored", "canceled"]) {
      expect(() => selectBuild([{ ...good, status }])).toThrow(/not completed/i);
    }
  });

  it("rejects debug profiles instead of silently distributing them", () => {
    expect(() => selectBuild({ ...good, buildProfile: "development" })).toThrow(/production-apk/);
  });

  it("rejects a non-Android build even if its archive is a ZIP", () => {
    expect(() => selectBuild([{ ...good, platform: "IOS" }])).toThrow(/no Android/i);
  });

  it("rejects metadata that does not identify the signing profile", () => {
    const { buildProfile: _discarded, ...withoutProfile } = good;
    expect(() => selectBuild(withoutProfile)).toThrow(/production-apk/);
  });

  it("rejects missing or insecure build URLs", () => {
    expect(() => selectBuild({ ...good, artifacts: {} })).toThrow(/HTTPS/);
    expect(() => selectBuild({ ...good, artifacts: { buildUrl: "http://example.com/app.apk" } })).toThrow(/HTTPS/);
  });
});
