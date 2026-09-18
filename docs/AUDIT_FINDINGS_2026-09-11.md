# MeTodo Full Audit Findings — 2026-09-11

## Confirmed baseline

The TypeScript compiler, Vitest suite, production server bundle, Expo lint, Expo prebuild configuration, Expo web export, and `git diff --check` all completed successfully on the restored project. The test suite reported 21 passing tests and one intentionally skipped existing auth test.

## Confirmed runtime findings

The development log reports repeated `props.pointerEvents is deprecated. Use style.pointerEvents` warnings, repeated `Error: Premature close` messages during the web development server lifecycle, and an `[expo-notifications]` web capability warning. The source tree also contains a direct `console.log(value, themeVariables)` in `lib/theme-provider.tsx`, which creates avoidable browser noise.

## Confirmed user-facing defect

Web preview screenshots for `/`, `/tasks`, `/settings`, and `/productivity-dashboard` render most NativeWind class names as unstyled text and full-width default browser layout. The tab bar is visible, but the intended cards, spacing, typography, surfaces, charts, and controls are not styled. This is a reproducible web UI defect despite successful TypeScript, lint, and export gates.

## Audit direction

The next fix must restore the web styling pipeline without weakening native behavior. It should verify NativeWind CSS import/configuration, eliminate the direct debug log, identify the source of the deprecated pointer-events prop, and re-run screenshot and distribution validation afterward.
