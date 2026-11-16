import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

// Exercise the actual EAS helper in a separate Node ESM process. This avoids
// inconsistent .mjs transformation by Vitest on Windows runners.
const moduleUrl = pathToFileURL(path.resolve(process.cwd(), "scripts/download-eas-android-build.mjs")).href;

const good = {
  id: "eas-test-id",
  platform: "ANDROID",
  status: "FINISHED",
  buildProfile: "production-apk",
  artifacts: { buildUrl: "https://expo.dev/artifacts/example.apk" },
};

function selectMetadata(value: unknown): { ok: boolean; result?: { id: string; url: string }; error?: string } {
  const script = [
    `import { selectBuild } from ${JSON.stringify(moduleUrl)};`,
    `try { console.log(JSON.stringify({ ok: true, result: selectBuild(${JSON.stringify(value)}) })); }`,
    `catch (error) { console.log(JSON.stringify({ ok: false, error: String(error) })); }`,
  ].join("\n");
  const processResult = spawnSync(process.execPath, ["--input-type=module", "-e", script], {
    encoding: "utf8",
    timeout: 10000,
  });
  if (processResult.error) throw processResult.error;
  if (processResult.status !== 0) {
    throw new Error(processResult.stderr || "EAS helper subprocess exited unsuccessfully");
  }
  return JSON.parse(processResult.stdout.trim());
}

describe("EAS signed Android artifact metadata", () => {
  it("accepts completed Android production-apk builds", () => {
    expect(selectMetadata([good])).toEqual({
      ok: true,
      result: { id: "eas-test-id", url: "https://expo.dev/artifacts/example.apk" },
    });
  });

  it("rejects incomplete or unsuccessful builds", () => {
    for (const status of ["in-progress", "errored", "canceled"]) {
      const result = selectMetadata([{ ...good, status }]);
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/not completed/i);
    }
  });

  it("rejects iOS metadata even if the artifact is an archive", () => {
    const result = selectMetadata([{ ...good, platform: "IOS" }]);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/no Android/i);
  });

  it("requires an explicit production signing profile", () => {
    const { buildProfile: _discarded, ...withoutProfile } = good;
    const result = selectMetadata(withoutProfile);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/production-apk/);
  });

  it("rejects insecure or missing application URLs", () => {
    for (const artifacts of [{}, { buildUrl: "http://example.com/file.apk" }]) {
      const result = selectMetadata({ ...good, artifacts });
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/HTTPS/);
    }
  });
});
