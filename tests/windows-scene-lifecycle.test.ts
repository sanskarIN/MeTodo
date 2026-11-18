import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

type SceneNode = {
  id: string;
  textContent: string;
  childElementCount: number;
  parentElement: SceneNode | null;
  width: number;
  height: number;
  clipped: boolean;
  inactive: boolean;
  inert: boolean;
  attributes: Record<string, string>;
  style: { height: string; minHeight: string; setProperty: (key: string, value: string) => void };
  setAttribute: (key: string, value: string) => void;
  hasAttribute: (key: string) => boolean;
  getAttribute: (key: string) => string | null;
  getBoundingClientRect: () => { width: number; height: number; top: number; bottom: number; left: number; right: number };
};

function element(width: number, height: number, parent: SceneNode | null = null, textContent = ""): SceneNode {
  const attributes: Record<string, string> = {};
  const style = {
    height: "", minHeight: "",
    setProperty(key: string, value: string) {
      if (key === "height") this.height = value;
      if (key === "min-height") this.minHeight = value;
    },
  };
  return {
    id: "", textContent, parentElement: parent,
    childElementCount: textContent ? 0 : 1,
    width, height, clipped: false, inactive: false, inert: false,
    attributes, style,
    setAttribute(key, value) { attributes[key] = value; },
    hasAttribute(key) { return Object.hasOwn(attributes, key); },
    getAttribute(key) { return attributes[key] ?? null; },
    getBoundingClientRect() {
      const usedHeight = style.height ? Number.parseInt(style.height, 10) : height;
      return { width, height: usedHeight, top: 18, bottom: 18 + usedHeight, left: 0, right: width };
    },
  };
}

describe("native Windows scene recovery lifecycle", () => {
  it("repairs a collapsed current scene, skips hidden routes, and updates repaired heights on resize", () => {
    const root = element(900, 600);
    root.id = "root";
    const homeScene = element(790, 0, root);
    homeScene.clipped = true;
    const homeHeading = element(115, 20, homeScene, "Stay productive");
    const headings = [homeHeading];
    const scenes = [homeScene];
    const pageEvents: Record<string, () => void> = {};
    const windowEvents: Record<string, () => void> = {};
    const scheduled: Array<{ fn: () => void; delay: number }> = [];
    let mutation: () => void = () => {};
    const document = {
      readyState: "loading",
      documentElement: { setAttribute(_key: string, _value: string) {} },
      body: { appendChild(_node: unknown) {} },
      getElementById(id: string) { return id === "root" ? root : null; },
      addEventListener(name: string, fn: () => void) { pageEvents[name] = fn; },
      createElement(_tag: string) {
        return { style: { cssText: "" }, textContent: "",
          setAttribute(_key: string, _value: string) {},
          addEventListener(_name: string, _fn: () => void) {} };
      },
      querySelectorAll(selector: string) {
        if (selector === "h1,h2,h3,p,span,div") return headings;
        if (selector === '[data-metodo-repaired-scene="true"]')
          return scenes.filter(scene => scene.hasAttribute("data-metodo-repaired-scene"));
        return [];
      },
    };
    const window = {
      addEventListener(name: string, fn: () => void) { windowEvents[name] = fn; },
      getComputedStyle(node: SceneNode) {
        return { display: node.inactive ? "none" : "block",
          visibility: "visible", opacity: "1",
          overflowY: node.clipped ? "hidden" : "visible",
          overflow: node.clipped ? "hidden" : "visible" };
      },
    };
    class FakeMutationObserver {
      constructor(fn: () => void) { mutation = fn; }
      observe(_root: unknown, _options: unknown) {}
    }
    const context = {
      document, window, MutationObserver: FakeMutationObserver,
      setTimeout(fn: () => void, delay: number) { scheduled.push({ fn, delay }); },
      innerHeight: 600, innerWidth: 900,
    };
    const source = readFileSync("scripts/windows-diagnostic-bootstrap.js", "utf8")
      .replace("__BUILD__", JSON.stringify("unit-test"));
    runInNewContext(source, context);
    const flushRecovery = () => {
      const index = scheduled.findIndex(task => task.delay === 120);
      expect(index).toBeGreaterThanOrEqual(0);
      scheduled.splice(index, 1)[0].fn();
    };
    pageEvents.DOMContentLoaded();
    flushRecovery();
    expect(homeScene.style.height).toBe("600px");
    expect(homeScene.hasAttribute("data-metodo-repaired-scene")).toBe(true);

    homeScene.inactive = true;
    const tasksScene = element(790, 0, root);
    tasksScene.clipped = true;
    scenes.push(tasksScene);
    headings.push(element(180, 20, tasksScene, "Manage your tasks"));
    mutation();
    flushRecovery();
    expect(tasksScene.style.height).toBe("600px");

    context.innerHeight = 360;
    windowEvents.resize();
    flushRecovery();
    expect(homeScene.style.height).toBe("360px");
    expect(tasksScene.style.height).toBe("360px");
  });
});
