import fs from "node:fs";
import { describe, expect, it } from "vitest";

const read = (file: string) => fs.readFileSync(file, "utf8");

describe("Stable release requires staged human approval", () => {
  const candidate = read(".github/workflows/release-workflow.yml");
  const publish = read(".github/workflows/publish-stable.yml");

  it("never publishes from the signed candidate creation workflow", () => {
    expect(candidate).toContain("workflow_dispatch:");
    expect(candidate).toContain("name: Build Signed Release Candidate");
    expect(candidate).toContain("name: metodo-candidate-android");
    expect(candidate).toContain("name: metodo-candidate-web");
    expect(candidate).toContain("apksigner");
    expect(candidate).not.toContain("  publish:");
    expect(candidate).not.toContain("action-gh-release");
  });

  it("runs every required platform test on the actual protected-main release commit", () => {
    for (const platform of ["android", "ios", "linux", "macos", "windows"]) {
      const workflow = read(`.github/workflows/build-${platform}.yml`);
      expect(workflow).toContain("    if: github.event_name == 'pull_request' || github.ref == 'refs/heads/main'");
      expect(workflow).toContain("    needs: build");
    }
  });

  it("requires separate device evidence and hashes to publish", () => {
    expect(publish).toContain("workflow_dispatch:");
    expect(publish).toContain("environment: stable-release");
    expect(publish).toContain("METODO_RELEASE_APPROVED_SHA");
    expect(publish).toContain("confirmPhysicalDeviceTests");
    expect(publish).toContain("deviceTestEvidenceUrl");
    expect(publish).toContain("issues/comments/$comment_id");
    expect(publish).toContain('contains($sha) and contains($apk) and contains($web)');
    expect(publish).toContain('issues: read');
    expect(publish).toContain("testedApkSha256");
    expect(publish).toContain("testedWebSha256");
    expect(publish).toContain("candidateRunId");
    expect(publish).toContain("sha256sum --check");
    expect(publish).toContain("run-id:");
    expect(publish).toContain("head_sha == $sha");
    expect(publish).toContain('conclusion == "success"');
    expect(publish).toContain("softprops/action-gh-release");
    expect(publish).not.toContain("push:");
    expect(publish).not.toContain("if: always()");
  });
});
