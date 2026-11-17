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
      " visibility=" + style.visibility +
      " opacity=" + style.opacity +
      " color=" + style.color +
      " bg=" + style.backgroundColor +
      " z=" + style.zIndex +
      " position=" + style.position +
      " transform=" + style.transform +
      " filter=" + style.filter;
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
    for (var i = 0; node && i < 8; i++, node = node.parentElement) {
      lines.push("  " + node.tagName.toLowerCase() + "[" + i + "]: " + geom(node));
    }
    return lines.join("\n");
  }
  function stackingEvidence(node) {
    if (!node) return "no known Home heading";
    var alpha = 1;
    var current = node;
    var transparentAncestor = "none";
    for (var i = 0; current && i < 14; i++, current = current.parentElement) {
      var a = Number(window.getComputedStyle(current).opacity);
      if (isFinite(a)) alpha *= a;
      if (a === 0 && transparentAncestor === "none") {
        transparentAncestor = current.tagName.toLowerCase() + "[" + i + "]";
      }
    }
    var r = node.getBoundingClientRect();
    var topElement = document.elementFromPoint(
      Math.max(0, Math.min(innerWidth - 1, r.left + 3)),
      Math.max(0, Math.min(innerHeight - 1, r.top + r.height / 2))
    );
    var relationship = topElement === node ? "heading" :
      (topElement && node.contains(topElement)) ? "heading descendant" :
      (topElement && topElement.contains(node)) ? "ancestor" : "possibly overlaid";
    return "effective opacity=" + alpha.toFixed(3) +
      " zero-opacity ancestor=" + transparentAncestor +
      " hit-test=" + relationship +
      " top-tag=" + (topElement ? topElement.tagName.toLowerCase() : "none");
  }
  // Expose only fixed, non-personal paint metrics in an accessible button.
  // Windows UI Automation can read this without a WebView2 debug port.
  function paintSummary() {
    var header = fixedAnchor("Stay productive");
    if (!header) return "METODO-PAINT dom=0";
    var style = window.getComputedStyle(header);
    var rect = header.getBoundingClientRect();
    var node = header;
    var alpha = 1;
    var hidden = "none";
    for (var i = 0; node && i < 16; i++, node = node.parentElement) {
      var currentStyle = window.getComputedStyle(node);
      var a = Number(currentStyle.opacity);
      if (isFinite(a)) alpha *= a;
      if (hidden === "none" && (a === 0 || currentStyle.visibility === "hidden" ||
        currentStyle.display === "none")) hidden = "ancestor" + i;
    }
    var hit = document.elementFromPoint(
      Math.max(0, Math.min(innerWidth - 1, rect.left + 4)),
      Math.max(0, Math.min(innerHeight - 1, rect.top + rect.height / 2))
    );
    var overlap = hit && (hit === header || header.contains(hit) || hit.contains(header))
      ? "no" : "yes";
    var color = style.color.replace(/[^a-zA-Z0-9(),. %]/g, "").slice(0, 55);
    var background = window.getComputedStyle(document.body).backgroundColor
      .replace(/[^a-zA-Z0-9(),. %]/g, "").slice(0, 55);
    return "METODO-PAINT dom=1 fg=" + color + " bodyBg=" + background +
      " alpha=" + alpha.toFixed(3) + " hidden=" + hidden +
      " overlaid=" + overlap +
      " rect=" + Math.round(rect.left) + "," + Math.round(rect.top) +
      "," + Math.round(rect.width) + "," + Math.round(rect.height);
  }

  function layerSummary() {
    var h = fixedAnchor("Stay productive");
    if (!h) return "METODO-LAYER dom=0";
    var style = window.getComputedStyle(h);
    var r = h.getBoundingClientRect();
    var x = r.left + Math.min(5, r.width / 2);
    var y = r.top + r.height / 2;
    var ignoredPointerPaint = 0;
    var otherPaint = 0;
    var nodes = document.querySelectorAll("div,section,main,nav,aside");
    for (var i = 0; i < nodes.length && i < 15000; i++) {
      var el = nodes[i];
      if (el === h || el.contains(h) || h.contains(el)) continue;
      var b = el.getBoundingClientRect();
      if (b.width < 8 || b.height < 8 || x < b.left || x >= b.right ||
          y < b.top || y >= b.bottom) continue;
      var st = window.getComputedStyle(el);
      var bg = st.backgroundColor.replace(/\s+/g, "");
      var paints = bg !== "transparent" && bg !== "rgba(0,0,0,0)" &&
        bg !== "rgba(0,0,0,0.0)";
      if (paints && Number(st.opacity) > 0) {
        if (st.pointerEvents === "none") ignoredPointerPaint++;
        else otherPaint++;
      }
    }
    var clipping = "none";
    for (var parent = h, depth = 0; parent && depth < 16;
         parent = parent.parentElement, depth++) {
      var ps = window.getComputedStyle(parent);
      if (ps.clipPath !== "none" || ps.maskImage !== "none") {
        clipping = "ancestor" + depth;
        break;
      }
    }
    var fill = (style.webkitTextFillColor || "unset").replace(
      /[^a-zA-Z0-9(),. %]/g, "").slice(0, 45);
    return "METODO-LAYER fill=" + fill +
      " clip=" + clipping + " overflow=" + style.overflow +
      " pointerlessBg=" + ignoredPointerPaint + " otherBg=" + otherPaint;
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
      "Theme: " + (document.documentElement.dataset.theme || "unset"),
      "Foreground token: " + window.getComputedStyle(document.documentElement).getPropertyValue("--color-foreground").trim(),
      "Background token: " + window.getComputedStyle(document.documentElement).getPropertyValue("--color-background").trim(),
      "External CSS loaded: " + readyCss + "/" + css.length,
      "External JS tags: " + document.querySelectorAll("script[src]").length,
      "Home content found: " + Boolean(header),
      "Home heading: " + geom(header),
      "Home ancestors:\n" + parentGeometry(header),
      "Home paint check: " + stackingEvidence(header),
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
      var paintButton = button("METODO-PAINT pending", function () { showPanel(false); });
      paintButton.id = "metodo-paint-summary";
      paintButton.setAttribute("data-metodo-paint-summary", "true");
      paintButton.style.cssText += "display:block;white-space:normal;text-align:left;margin-bottom:6px;word-break:break-word;";
      panel.appendChild(paintButton);
      var layerButton = button("METODO-LAYER pending", function () { showPanel(false); });
      layerButton.setAttribute("data-metodo-layer-summary", "true");
      layerButton.style.cssText += "display:block;white-space:normal;text-align:left;word-break:break-word;";
      panel.appendChild(layerButton);
      panel.appendChild(button("Reload UI (keeps tasks)", function () { location.reload(); }));
      panel.appendChild(button("Close", function () { panel.remove(); panel = null; }));
      document.body.appendChild(panel);
    }
    panel.querySelector("[data-metodo-description]").textContent = failed
      ? "The Windows app loaded but main screen content is missing. Do not clear or uninstall application data. Report only the technical fields below."
      : "Native renderer information. These fields contain no saved task content.";
    panel.querySelector("[data-metodo-report]").textContent = report();
    panel.querySelector("[data-metodo-paint-summary]").textContent = paintSummary();
    panel.querySelector("[data-metodo-layer-summary]").textContent = layerSummary();
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
