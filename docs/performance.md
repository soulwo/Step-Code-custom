# Performance verification

Use this guide to measure the customization layer without relying on unverified speedup claims. Record the commit SHA, hardware, operating system, Node.js and pnpm versions, configuration, and cache state with every comparison.

## Built-in startup profile

Build first, then run repeated RPC startup measurements with an isolated agent directory:

```bash
pnpm run build:offline
pnpm run profile:rpc --runs 5 --warmup 2 --isolated-agent-dir
```

Profile the standalone coding-agent bundle separately:

```bash
pnpm run profile:rpc --bundle --runs 5 --warmup 2 --isolated-agent-dir
```

The profiler measures startup through a real RPC `get_state` response. Warmup runs reduce first-load distortion, and the isolated agent directory avoids reading your normal credentials, sessions, and machine-specific configuration. Add `--cpu-profile` when CPU profiles are needed for deeper analysis; they are written under `profiles-node` by default.

Use `pnpm run profile:rpc --help` for all supported options. The current profiler supports RPC mode.

## Compare changes consistently

1. Choose a baseline commit and a candidate commit.
2. Use the same Node.js version, dependency installation mode, model data, and configuration for both.
3. Run the same warmup and measurement counts, alternating baseline and candidate where practical.
4. Separate cold-cache first runs from warm-cache runs instead of averaging them together.
5. Keep the generated model data unchanged when measuring runtime changes; use `build:offline` for reproducibility.
6. Record medians and the full run samples, not only the fastest result.

A comparison is meaningful only when the functional checks also pass:

```bash
pnpm run check
./test.sh
```

On Windows, report platform or symlink limitations separately from performance results and code failures.

## Configuration experiments

Change one setting at a time and document its value. Defaults and validation rules are in the [customization guide](customization.md).

| Experiment | Baseline | Candidate | What to verify |
| --- | --- | --- | --- |
| Streaming parse scheduling | `streamingParseIntervalMs = 0` | `24` | CPU work and complete final tool-call parsing |
| Model-catalog freshness | `modelCatalogTtlMs = 0` | `300000` | Startup work, fresh-cache behavior, and background refresh |
| File metadata I/O | A measured lower concurrency | `findStatConcurrency = 32` | Elapsed time and filesystem behavior |
| Session scanning | A measured lower concurrency | `sessionScanConcurrency = 8` | Discovery time and disk pressure |

Do not infer a user-visible improvement from reduced work alone. Confirm output completeness, state integrity, cache freshness, and error handling before claiming that a configuration is better for a given workload.

## What to publish with results

- Baseline and candidate commit SHAs.
- Hardware, operating system, Node.js, and pnpm versions.
- Exact commands and custom configuration.
- Warmup/run counts and cold/warm cache classification.
- Raw timing samples and the validation result.
- Any platform-specific exclusions or failed environment prerequisites.
