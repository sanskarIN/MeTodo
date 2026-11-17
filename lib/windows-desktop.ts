/** Detect the bundled Windows Tauri custom-protocol origin, not ordinary web. */
export function isWindowsDesktopRuntime(): boolean {
  return typeof window !== "undefined" &&
    window.location.hostname.toLowerCase() === "tauri.localhost";
}
