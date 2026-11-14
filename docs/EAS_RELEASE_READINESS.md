# EAS Release Readiness

## Purpose

This guide records the **credential-free** release configuration for MeTodo. The repository now contains `eas.json` profiles for internal Android APK validation, iOS Simulator validation, and a production profile. The configuration does not include an Expo access token, Android keystore, Apple certificate, provisioning profile, or `credentials.json` file.

> Keep release credentials outside version control. Expo recommends ignoring both `credentials.json` and the files it references because they contain signing secrets.[1]

## Build Profiles

| Profile | Android behavior | iOS behavior | Intended use | Credentials committed? |
|---|---|---|---|---|
| `development` | Internal unsigned APK | Simulator binary | Developer and CI smoke testing | No |
| `preview` | Internal unsigned APK | Simulator binary | Stakeholder validation before signing | No |
| `production` | Store-ready build after credential setup | Store-ready build after credential setup | Google Play and App Store releases | No |

The internal profiles explicitly set Android `withoutCredentials` and iOS `simulator`, so they can exercise native generation without distributing a signed store binary. Production remains intentionally credential-neutral: EAS resolves managed credentials remotely unless a release owner deliberately configures another source.[1][2]

## Preconditions

The Expo configuration already defines the MeTodo application identifiers:

| Platform | Identifier | Source |
|---|---|---|
| Android | `com.app.metodo` | `app.config.ts` |
| iOS | `com.app.metodo` | `app.config.ts` |

Before the first EAS cloud build, the repository owner must link the project to the correct Expo account or organization. EAS creates or confirms that linkage when `eas build:configure` or the first EAS build is run.[2]

## Safe Build Commands

Run these commands from a clean, reviewed commit. The `requireCommit` setting in `eas.json` enforces this guardrail.

```bash
# Internal Android validation APK; no signing material is stored in Git.
npx eas-cli@latest build --platform android --profile development

# iOS Simulator validation; no Apple distribution certificate is required.
npx eas-cli@latest build --platform ios --profile development

# Production release: run only after the release owner configures managed or local credentials.
npx eas-cli@latest build --platform all --profile production
```

## Production Signing Handoff

The release owner should choose one credential strategy. **Managed credentials** are the preferred low-maintenance option: EAS stores and resolves the signing records remotely. **Local credentials** are appropriate only when the owner must control the Android keystore, iOS certificate, or provisioning profile directly.[1]

| Step | Owner action | Repository policy |
|---|---|---|
| 1 | Sign in to the intended Expo account and link the project | Do not commit access tokens or generated configuration containing secrets |
| 2 | Configure Android Play credentials and iOS Apple Developer credentials | Keep raw signing files in secure credential storage |
| 3 | Run a production build from an approved commit on `main` | Protected branch requires owner review and all required CI contexts |
| 4 | Verify generated identifiers and store metadata | Do not publish until an owner validates the binary |

If local credentials are selected, create them only on a secure release machine or restore them from encrypted CI secrets. `credentials.json`, keystores, certificates, profiles, and private keys are all ignored by this repository.

## Relationship to GitHub CI

GitHub Actions validates Android native generation and an unsigned debug APK, iOS native generation and a simulator build, and production-web distribution checks for Linux, macOS, and Windows. Those validations are required on `main`; EAS production builds are intentionally a separate owner-controlled signing step.

## References

[1]: https://docs.expo.dev/app-signing/local-credentials/ "Expo: Using local credentials"
[2]: https://docs.expo.dev/build/eas-json/ "Expo: Configure EAS Build with eas.json"
