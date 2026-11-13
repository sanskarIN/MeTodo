#!/usr/bin/env node
/**
 * Download a completed EAS Android production build from --json output.
 * Never substitute a debug APK or fabricate a successful release artifact.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

export function selectBuild(raw) {
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  const candidates = Array.isArray(data)
    ? data
    : Array.isArray(data?.builds)
      ? data.builds
      : [data?.build ?? data];
  const build = candidates.find((item) => String(item?.platform).toLowerCase() === "android");
  if (!build) {
    throw new Error("EAS metadata contains no Android build");
  }
  if (String(build.status).toLowerCase() !== "finished") {
    throw new Error("EAS has not completed the Android build successfully");
  }
  // A missing profile is not evidence of production signing.
  if (build.buildProfile !== "production-apk") {
    throw new Error("EAS build must identify the production-apk signing profile");
  }
  const url = build.artifacts?.buildUrl;
  if (typeof url !== "string" || new URL(url).protocol !== "https:") {
    throw new Error("EAS did not return an HTTPS application artifact URL");
  }
  return { url, id: build.id ?? "unknown" };
}

export async function downloadBuild(raw, destination) {
  if (!destination.endsWith(".apk")) {
    throw new Error("Destination must be an APK file");
  }
  const { url, id } = selectBuild(raw);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok || !response.body) {
    throw new Error("EAS download failed: HTTP " + response.status);
  }
  try {
    await pipeline(Readable.fromWeb(response.body), createWriteStream(destination));
    const stats = fs.statSync(destination);
    if (stats.size < 100000) {
      throw new Error("Downloaded APK is unexpectedly small");
    }
    const fh = fs.openSync(destination, "r");
    const header = Buffer.alloc(4);
    try {
      fs.readSync(fh, header, 0, 4, 0);
    } finally {
      fs.closeSync(fh);
    }
    if (header[0] !== 0x50 || header[1] !== 0x4b || header[2] !== 0x03 || header[3] !== 0x04) {
      throw new Error("Downloaded artifact is not an APK/ZIP archive");
    }
    const digest = createHash("sha256").update(fs.readFileSync(destination)).digest("hex");
    return { buildId: id, size: stats.size, sha256: digest };
  } catch (error) {
    fs.rmSync(destination, { force: true });
    throw error;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const [metadataPath, outputPath] = process.argv.slice(2);
  if (!metadataPath || !outputPath) {
    console.error("Usage: node scripts/download-eas-android-build.mjs <build.json> <output.apk>");
    process.exitCode = 2;
  } else {
    try {
      const result = await downloadBuild(fs.readFileSync(metadataPath, "utf8"), outputPath);
      console.log("EAS build: " + result.buildId + "; bytes: " + result.size + "; SHA256: " + result.sha256);
    } catch (error) {
      console.error(String(error));
      process.exitCode = 1;
    }
  }
}
