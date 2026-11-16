import fs from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => fs.readFileSync(path, "utf8");

describe("Web-only v1.0.0 requires a separately reviewed release candidate", () => {
  const candidate = read(".github/workflows/release-workflow.yml");
  const publish = read(".github/workflows/publish-stable.yml");

  it("exports a versioned web archive without shipping native builds or publishing", () => {
    expect(candidate).toContain("name: Build Web Release Candidate");
    expect(candidate).toContain("workflow_dispatch:");
    expect(candidate).toContain("expo export --platform web --output-dir dist/web");
    expect(candidate).toContain("name: metodo-candidate-web");
    expect(candidate).toContain("SHA256SUMS-candidate");
    expect(candidate).toContain("pnpm audit --prod --audit-level high");
    expect(candidate).not.toContain("eas-cli");
    expect(candidate).not.toContain("production-apk");
    expect(candidate).not.toMatch(/^\s{2}android:/m);
    expect(candidate).not.toContain("action-gh-release");
  });

  it("requires exact protected main provenance, independently tested web hash and issue 16 evidence", () => {
    expect(publish).toContain("workflow_dispatch:");
    expect(publish).toContain("environment: stable-release");
    expect(publish).toContain("METODO_RELEASE_APPROVED_SHA");
    expect(publish).toContain("confirmBrowserTests");
    expect(publish).toContain("browserTestEvidenceUrl");
    expect(publish).toContain("issues/16#issuecomment-");
    expect(publish).toContain('contains($sha) and contains($web) and contains("Web QA: PASS")');
    expect(publish).toContain("testedWebSha256");
    expect(publish).toContain("candidateRunId");
    expect(publish).toContain("head_sha == $sha");
    expect(publish).toContain('conclusion == "success"');
    expect(publish).toContain("Validate MeTodo");
    expect(publish).toContain("sha256sum --check");
    expect(publish).toContain("name: metodo-candidate-web");
    expect(publish).toContain("run-id:");
    expect(publish).toContain("SHA256SUMS-candidate");
    expect(publish).toContain("softprops/action-gh-release");
    expect(publish).not.toContain("testedApkSha256");
    expect(publish).not.toContain("confirmPhysicalDeviceTests");
    expect(publish).not.toContain("MeTodo-v*-android.apk");
    expect(publish).not.toContain("Build Android APK");
    expect(publish).not.toContain("push:");
    expect(publish).not.toContain("if: always()");
  });
});
