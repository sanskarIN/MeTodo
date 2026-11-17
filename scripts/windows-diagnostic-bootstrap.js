/* Trial-only diagnostics. Never read, transmit or modify saved tasks. */
(function () {
  "use strict";
  var revision = __BUILD__;
  var errors = 0;
  var rejections = 0;
  var panel = null;
  var badge = null;
  document.documentElement.setAttribute("data-metodo-windows-trial", revision);
  window.addEventListener("error", function () { errors++; }, true);
  window.addEventListener("unhandledrejection", function () { rejections++; });

  function isVisible(el) {
    if (!el) return false;
    var r = el.getBoundingClientRect();
    var s = window.getComputedStyle(el);
    return r.width >= 20 && r.height >= 8 && r.top < innerHeight && r.bottom > 0 &&
      s.display !== "none" && s.visibility !== "hidden";
  }
  function hasContent() {
    var anchors = {
      "Stay productive": 1,
      "Manage your tasks": 1,
      "Customize your experience": 1,
      "Loading your local tasks…": 1,
      "Local data needs attention": 1,
      "Reading saved tasks…": 1,
      "Saved tasks could not be loaded safely": 1
    };
    var elements = document.querySelectorAll("h1,h2,h3,span,p,div");
    for (var i = 0; i < elements.length; i++) {
      var node = elements[i];
      if (!node.childElementCount && anchors[(node.textContent || "").trim()] && isVisible(node)) {
        return true;
      }
    }
    return false;
  }
  function geom(el) {
    if (!el) return "absent";
    var r = el.getBoundingClientRect();
    var style = window.getComputedStyle(el);
    return "xy=" + Math.round(r.left) + "," + Math.round(r.top) +
      " wh=" + Math.round(r.width) + "x" + Math.round(r.height) +
      " display=" + style.display +
      " flex=" + style.flex +
      " overflow=" + style.overflow +
      " visibility=" + style.visibility;
  }
  function fixedAnchor(label) {
    var nodes = document.querySelectorAll("h1,h2,h3,p,span,div");
    for (var i = 0; i < nodes.length; i++) {
      if (!nodes[i].childElementCount &&
          (nodes[i].textContent || "").trim() === label) return nodes[i];
    }
    return null;
  }
  function parentGeometry(node) {
    var lines = [];
    for (var i = 0; node && i < 5; i++, node = node.parentElement) {
      lines.push("  " + node.tagName.toLowerCase() + "[" + i + "]: " + geom(node));
    }
    return lines.join("\n");
  }
  function report() {
    var root = document.getElementById("root");
    var css = document.querySelectorAll('link[rel="stylesheet"]');
    var readyCss = 0;
    for (var i = 0; i < css.length; i++) if (css[i].sheet) readyCss++;
    var header = fixedAnchor("Stay productive");
    var loading = fixedAnchor("Loading your local tasks…");
    var tabs = fixedAnchor("Home");
    var inner = root && root.firstElementChild;
    return [
      "Build: " + revision,
      "Viewport: " + innerWidth + " x " + innerHeight,
      "Ready: " + document.readyState,
      "Body: " + geom(document.body),
      "Root: " + geom(root),
      "Root child: " + geom(inner),
      "Root grandchildren: " + (inner ? inner.childElementCount : 0),
      "Native stylesheets: " + document.styleSheets.length,
      "External CSS loaded: " + readyCss + "/" + css.length,
      "External JS tags: " + document.querySelectorAll("script[src]").length,
      "Home content found: " + Boolean(header),
      "Home heading: " + geom(header),
      "Home ancestors:\n" + parentGeometry(header),
      "Loading indicator: " + geom(loading),
      "Home tab: " + geom(tabs),
      "Any known screen content: " + hasContent(),
      "Resource or JS errors: " + errors,
      "Unhandled promises: " + rejections
    ].join("\n");
  }
  function button(text, click) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = text;
    b.style.cssText = "cursor:pointer;padding:7px 10px;border-radius:8px;border:1px solid #a3a3a3;background:#e0f2fe;color:#111827;font:600 12px system-ui;margin:4px;";
    b.addEventListener("click", click);
    return b;
  }
  function showPanel(failed) {
    if (!document.body) return;
    if (!panel) {
      panel = document.createElement("div");
      panel.setAttribute("role", "status");
      panel.setAttribute("data-metodo-diagnostics", "true");
      panel.style.cssText = "position:fixed;top:42px;right:10px;z-index:2147483647;width:min(450px,calc(100vw - 20px));max-height:78vh;overflow:auto;background:#fff7ed;border:2px solid #b45309;color:#111827;border-radius:12px;box-shadow:0 8px 30px #0004;padding:14px;box-sizing:border-box;font:14px system-ui;";
      var title = document.createElement("strong");
      title.textContent = "MeTodo Windows renderer diagnostics";
      panel.appendChild(title);
      var desc = document.createElement("p");
      desc.setAttribute("data-metodo-description", "true");
      panel.appendChild(desc);
      var pre = document.createElement("pre");
      pre.setAttribute("data-metodo-report", "true");
      pre.style.cssText = "white-space:pre-wrap;overflow-wrap:anywhere;background:#fffbeb;border:1px solid #f59e0b;padding:8px;font:12px/1.5 Consolas,monospace;";
      panel.appendChild(pre);
      panel.appendChild(button("Reload UI (keeps tasks)", function () { location.reload(); }));
      panel.appendChild(button("Close", function () { panel.remove(); panel = null; }));
      document.body.appendChild(panel);
    }
    panel.querySelector("[data-metodo-description]").textContent = failed
      ? "The Windows app loaded but main screen content is missing. Do not clear or uninstall application data. Report only the technical fields below."
      : "Native renderer information. These fields contain no saved task content.";
    panel.querySelector("[data-metodo-report]").textContent = report();
  }
  function mount() {
    if (!document.body) return;
    if (!badge) {
      badge = button("Windows trial " + revision + " · diagnostics", function () { showPanel(false); });
      badge.setAttribute("data-metodo-build-badge", revision);
      badge.style.cssText += "position:fixed;right:8px;top:5px;z-index:2147483646;opacity:0.96;font-size:11px;padding:5px;";
      document.body.appendChild(badge);
    }
  }
  function check() {
    mount();
    // This is a Windows-only unsigned diagnostic build. Show the technical
    // state even if a DOM bounding rect incorrectly claims content is visible
    // while an ancestor clips or overlays the screen.
    showPanel(!hasContent());
  }
  function start() {
    mount();
    setTimeout(check, 10000);
    setTimeout(check, 18000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
