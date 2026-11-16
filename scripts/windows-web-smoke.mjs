/**
 * CI smoke test of the exported Expo web UI in actual Microsoft Edge.
 * The probe is injected in the temporary HTTP response, never into the
 * application assets used by Tauri.
 */
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const root = path.resolve("dist/windows-web");
const index = path.join(root, "index.html");
if (!existsSync(index)) throw new Error("Production web index.html is absent");
if (process.platform !== "win32") throw new Error("Smoke test requires Windows");
const edgeLocations = [
  path.join(process.env["PROGRAMFILES(X86)"] ?? "C:\\Program Files (x86)", "Microsoft", "Edge", "Application", "msedge.exe"),
  path.join(process.env.PROGRAMFILES ?? "C:\\Program Files", "Microsoft", "Edge", "Application", "msedge.exe"),
];
const edge = edgeLocations.find(existsSync);
if (!edge) throw new Error("Microsoft Edge is not installed");

const probe = [
  '<script id="metodo-ci-layout-probe">',
  'window.setTimeout(function() {',
  ' const root = document.getElementById("root");',
  ' const rootRect = root && root.getBoundingClientRect();',
  ' const match = (value) => Array.from(document.querySelectorAll("div, span, h1, h2, p"))',
  '   .find(el => el.childElementCount === 0 && el.textContent && el.textContent.trim() === value);',
  ' const heading = match("Stay productive");',
  ' const create = match("+ Create New Task");',
  ' const rect = heading && heading.getBoundingClientRect();',
  ' const created = create && create.getBoundingClientRect();',
  ' const visible = (r) => !!r && r.width >= 20 && r.height >= 8 && r.top >= -5 && r.top < window.innerHeight - 5;',
  ' const pass = !!rootRect && rootRect.height >= 350 && visible(rect) && visible(created);',
  ' document.documentElement.setAttribute("data-metodo-smoke-status", pass ? "pass" : "fail");',
  ' document.documentElement.setAttribute("data-metodo-smoke-details",',
  '   ["rootHeight=" + (rootRect && rootRect.height), "homeHeight=" + (rect && rect.height),',
  '    "createHeight=" + (created && created.height), "viewport=" + window.innerHeight].join(";"));',
  '}, 6000);',
  '</script>',
].join("\n");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};
let requests = 0;
const server = createServer((req, res) => {
  try {
    const requestUrl = new URL(req.url ?? "/", "http://127.0.0.1");
    const requestPath = decodeURIComponent(requestUrl.pathname);
    let target = path.resolve(root, "." + requestPath);
    if (target !== root && !target.startsWith(root + path.sep)) {
      res.writeHead(403); res.end(); return;
    }
    if (existsSync(target) && statSync(target).isDirectory()) {
      target = path.join(target, "index.html");
    }
    if (!existsSync(target) || !statSync(target).isFile()) {
      res.writeHead(404); res.end("Not found"); return;
    }
    requests++;
    res.setHeader("Content-Type", mime[path.extname(target)] ?? "application/octet-stream");
    if (target === index) {
      const html = readFileSync(target, "utf8");
      if (!html.includes("</body>")) throw new Error("Export HTML has no body");
      res.end(html.replace("</body>", probe + "\n</body>"));
    } else {
      res.end(readFileSync(target));
    }
  } catch (error) {
    console.error("Smoke server error:", error);
    res.writeHead(500); res.end("Internal error");
  }
});

let profile;
try {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address !== "object") throw new Error("No server port");
  profile = mkdtempSync(path.join(tmpdir(), "metodo-smoke-"));
  const origin = "http://127.0.0.1:" + address.port;
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--user-data-dir=" + profile,
    "--virtual-time-budget=15000",
    "--dump-dom",
    origin + "/",
  ];
  const child = spawn(edge, args, { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  let dom = "";
  let errors = "";
  child.stdout.on("data", data => {
    dom += data.toString();
    if (dom.length > 12_000_000) child.kill();
  });
  child.stderr.on("data", data => { errors = (errors + data.toString()).slice(-5000); });
  const timeout = setTimeout(() => child.kill(), 90000);
  const code = await new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("exit", resolve);
  });
  clearTimeout(timeout);
  const pass = /data-metodo-smoke-status="pass"/.test(dom);
  const details = dom.match(/data-metodo-smoke-details="([^"]*)"/)?.[1] ?? "no probe result";
  console.log("Windows Edge UI smoke:", { code, pass, details, requests });
  if (code !== 0 || !pass || requests < 3) {
    throw new Error("Production Home screen is blank or incorrectly sized. " +
      details + "; HTTP requests=" + requests + "\nEdge errors: " + errors.slice(-1500));
  }
} finally {
  await new Promise(resolve => server.close(resolve));
  if (profile) rmSync(profile, { recursive: true, force: true, maxRetries: 3 });
}
