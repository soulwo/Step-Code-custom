# Adaptive context management

Step Code Custom supports automatic compaction with a global context ratio and optional per-model overrides. Settings use the standard TOML files documented in [Step configuration files](step-configuration.md):

- Global: `~/.stepcode/config.toml`
- Trusted project override: `<cwd>/.stepcode/config.toml`

## Configure the trigger

The following example compacts at 85% of the model context window by default and at 80% for one model:

```toml
[compaction]
triggerRatio = 0.85
# Optional absolute ceiling; it can only trigger compaction earlier.
# tokenLimit = 120000

[compaction.modelTriggerRatios]
"provider/model-id" = 0.80
```

Replace `provider/model-id` with the provider and model identifier shown by your current model configuration. Other models continue to use `triggerRatio`.

| Setting | Default | Behavior |
| --- | ---: | --- |
| `triggerPolicy` | `"v2"` | Uses ratio-based triggering and response-headroom protection. |
| `triggerRatio` | `0.90` | Global context-window ratio. Valid values are `0.50` through `0.95`. |
| `modelTriggerRatios` | `{}` | Per-model ratios keyed by `provider/model-id`. |
| `tokenLimit` | unset | Optional positive token ceiling; it only makes compaction earlier. |
| `keepRecentTokens` | `20000` | Approximate recent content retained after compaction, not the trigger threshold. |

Invalid values produce settings diagnostics and fall back to their defaults instead of silently changing the trigger policy.

## Response room on smaller windows

The v2 policy also reserves room for the next response. A configured ratio is capped when necessary, and the threshold never falls below 50% of the declared context window. With the default ratio and an 8K-or-larger output limit, the effective thresholds are:

| Context window | Effective trigger | Approximate share |
| ---: | ---: | ---: |
| 16,384 tokens | 8,192 tokens | 50% |
| 32,768 tokens | 20,480 tokens | 62.5% |
| 65,536 tokens | 53,248 tokens | 81.25% |
| 131,072 tokens and larger | 90% of the window | 90% |

This prevents automatic compaction from starting so late that a small-window model has almost no output space left.

## Restore defaults or legacy behavior

Remove custom trigger keys to return to the v2 defaults. To select the previous reserve-based trigger explicitly, use:

```toml
[compaction]
triggerPolicy = "legacy"
```

An explicit `reserveTokens` value can only move the trigger earlier under the v2 policy. For session-history and summary behavior, see [Session compaction integrity](compaction-integrity.md).
