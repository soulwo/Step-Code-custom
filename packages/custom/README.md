# Step Code Custom customization package

This package contains the local customization primitives for `soulwo/Step-Code-custom`. Upstream packages call the public entry points instead of carrying scattered copies of local policy.

- `@step-harness/custom` exposes browser-safe configuration, bounded concurrency, streaming-parse scheduling, and model-catalog freshness helpers.
- `@step-harness/custom/node` exposes Node-only atomic file writes, selective warning filtering, and JSON configuration loading.

Keep the Node entry out of browser-facing imports. Atomic replacement preserves the destination's existing permission bits; the supplied `mode` is used when creating a new file.

## Unified configuration

Programmatic host configuration:

```ts
import { configureCustom } from "@step-harness/custom";

configureCustom({
  streamingParseIntervalMs: 24,
  streamingParseMinChars: 128,
  findStatConcurrency: 32,
  sessionScanConcurrency: 8,
  modelCatalogTtlMs: 300000,
});
```

The CLI and Bun entrypoints call `loadCustomConfig()` from `@step-harness/custom/node`. Set `STEPCODE_CUSTOM_CONFIG` to a JSON file to override the defaults without editing source:

```json
{
  "streamingParseIntervalMs": 24,
  "streamingParseMinChars": 128,
  "findStatConcurrency": 32,
  "sessionScanConcurrency": 8,
  "modelCatalogTtlMs": 300000,
  "suppressedWarningPatterns": ["SQLite"]
}
```

Set `streamingParseIntervalMs` to `0` to restore eager intermediate parsing, or `modelCatalogTtlMs` to `0` to force a startup model-catalog refresh.

## Upstream merges

Keep new local policies and utilities in this package. Upstream files should only contain small call-site adaptations. When merging upstream, first review this package's public API, then resolve call sites in `apps/cli`, `packages/coding-agent`, and `packages/providers`.

Do not replace this package blindly with upstream content. Preserve the browser-safe/Node-only split, run this package's tests, then run `pnpm run build:offline` and `pnpm run check` from the repository root.
