# StepCode local customization package

This package contains local customization primitives rather than forks of upstream modules. Upstream packages call the public entry point `@step-harness/custom`; new policy values belong in `src/config.ts`, not in scattered constants.

## Unified configuration

Programmatic host configuration:

```ts
import { configureCustom } from "@step-harness/custom";

configureCustom({
  streamingParseIntervalMs: 24,
  findStatConcurrency: 32,
  sessionScanConcurrency: 8,
  modelCatalogTtlMs: 300000,
});
```

A JSON file may be supplied with `STEPCODE_CUSTOM_CONFIG` (loaded by `loadCustomConfig` from `@step-harness/custom/node`). Supported keys are `streamingParseIntervalMs`, `streamingParseMinChars`, `findStatConcurrency`, `sessionScanConcurrency`, `modelCatalogTtlMs`, and `suppressedWarningPatterns`. Set `streamingParseIntervalMs` to `0` to restore eager intermediate parsing, or `modelCatalogTtlMs` to `0` to force a startup refresh.

## Upstream merges

Keep changes here when adding local policy or utilities. Upstream files should only contain small call-site adaptations. When merging upstream, first review this package's public API, then resolve call sites in `apps/cli`, `packages/coding-agent`, and `packages/providers`. Do not replace this package with upstream code blindly; compare behavior and run its tests before the monorepo build.
