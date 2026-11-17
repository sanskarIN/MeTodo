import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, join } from "node:path";

function listHtml(root) {
  const result = [];
  for (const item of readdirSync(root, { withFileTypes: true })) {
    const full = join(root, item.name);
    if (item.isDirectory()) result.push(...listHtml(full));
    else if (item.isFile() && item.name.endsWith(".html")) result.push(full);
  }
  return result;
}
const destination = resolve("dist/windows-web");
if (!existsSync(join(destination, "index.html"))) throw new Error("Missing Windows export index.html");
const script = readFileSync("scripts/windows-diagnostic-bootstrap.js", "utf8");
const expected = (process.env.METODO_SOURCE_SHA || "").trim().toLowerCase();
if (expected && !/^[0-9a-f]{40}$/.test(expected)) {
  throw new Error("Invalid METODO_SOURCE_SHA in Windows trial environment");
}
let checkedOutSha = "";
try { checkedOutSha = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim().toLowerCase(); }
catch { /* local ZIP builds may lack .git */ }
if (expected && checkedOutSha && expected !== checkedOutSha) {
  throw new Error("Windows trial source revision differs from checked-out code");
}
const sha = expected || checkedOutSha || (process.env.GITHUB_SHA || "").trim();
const revision = /^[0-9a-f]{40}$/i.test(sha) ? sha.toLowerCase().slice(0, 12) : "local-dev";
const js = script.replace("__BUILD__", JSON.stringify(revision));
if (js === script || /<\/script/i.test(js)) throw new Error("Unsafe diagnostic script content");
const html = listHtml(destination);
if (!html.length) throw new Error("Windows export contains no HTML files");
for (const file of html) {
  const raw = readFileSync(file, "utf8");
  if (!/<\/head>/i.test(raw) || raw.includes('id="metodo-desktop-diagnostic"')) {
    throw new Error("Invalid or already instrumented export: " + file);
  }
  writeFileSync(file, raw.replace(/<\/head>/i,
    '<script id="metodo-desktop-diagnostic">\n' + js + '\n</script>\n</head>'), "utf8");
}
writeFileSync(join(destination, "metodo-windows-trial-build.json"),
  JSON.stringify({ revision, trial: true, stable: false }, null, 2) + "\n", "utf8");
console.log("Windows WebView2 trial: " + revision + "; instrumented " + html.length + " HTML pages");
