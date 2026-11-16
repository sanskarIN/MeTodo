# Secure Metro image-size adapter

MeTodo uses Expo SDK 54 / Metro 0.83, which invokes `image-size` with a file
**path**. The patched `image-size` v2 API accepts a `Uint8Array` of
**bytes**, so a direct major-version override fails to transform assets.

This package preserves both common require entrypoints (`require("image-size")`
and `require("image-size").imageSize`) and the old pathname behavior,
reading the file as bytes before delegating **all decoding** to patched
`image-size-patched` alias of `image-size@2.0.3`.

The alias is pinned to patched code. No custom image parser is maintained.
The adapter is only for build-time Metro compatibility. Once upstream Metro
supports the v2 API directly, remove this adapter and its pnpm override.
Every dependency refresh must run Expo web export and Android debug build.
See `docs/SECURITY_AUDIT_FIRST_STABLE.md` for measured evidence.
