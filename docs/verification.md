# Verification evidence

This page records the latest verified downstream state. It is a dated snapshot, not a replacement for the live CI badges or the checks required for future changes.

## Current baseline

- Downstream release: `0.1.7`
- Release synchronization: `037090e`
- Lifecycle merge: `f386099`
- Upstream baseline: `c1e9e29` (background process ownership, session schedules, `/ps`, `/subagents`, and concurrency settings)
- Official release manifest: [`0.1.7`](https://static-openapi.stepfun.com/stepcode/0.1.7/manifest.json) (verified against the official Windows x64 package and SHA256)
- Branch relationship after the merge: 24 downstream commits ahead, 0 upstream commits behind.
- Main CI: [run 42573793593](https://github.com/soulwo/Step-Code-custom/actions/runs/42573793593)
- Production dependency audit: [run 42573918301](https://github.com/soulwo/Step-Code-custom/actions/runs/42573918301)

## Upstream behavior reviewed

- Command exit status, timeout, signal, and output remain distinct from tool-execution errors.
- Plan decisions persist as session facts across queueing, recovery, and compaction.
- An edit call that fails after modifying a file still exposes the applied diff.
- The withdrawn ambient-warning footer badge is not retained in the downstream.
- Incomplete assistant turns have explicit recovery behavior across persistence, print/JSON/RPC, background work, and subagents.
- Background processes have owners and kinds, are released only by the intended lifecycle boundary, and have parent-death reclamation.
- Scheduled tasks are session-bound with one-shot and interval schedules; `/ps` and `/subagents` expose session-scoped inspection and control.
- Subagent concurrency has an explicit default and setting, with workflow admission and rate-limit sharing preserved.
- Unfinished Responses tool calls fail closed instead of reaching execution.

## Custom behavior rechecked

- Custom JSON configuration loads through the real CLI; invalid values still reject startup.
- Successful Step catalog refreshes persist models and `checkedAt`; offline and failed refreshes retain usable state.
- Session directories use their creation-time root context rather than matching only the final path components.
- Provider parsing retains throttled intermediate updates and complete final tool arguments.
- Atomic state replacement, bounded find/session I/O, and the isolated `packages/custom` layer remain connected.
- Standalone bundles retain their ESM entry, module compatibility shims, themes, templates, and other runtime assets.

## Real execution evidence

The final merged tree passed:

```bash
pnpm run check
pnpm run build:offline
```

After the 0.1.7 synchronization, entrypoint checks return `0.1.7` for the source CLI, `apps/cli/dist/main.js`, and `packages/coding-agent/dist/bundle/step.js`. The standalone bundle also completes `--help` and a real RPC `get_state` request. See [Step Code 0.1.7 synchronization](release-0.1.7.md) for the official checksum, CLI comparison, and feature-by-feature review.

The terminal illustration is selected from the final bundle's real `--help` output. It includes the current `--plan-review-surface` RPC option rather than an obsolete command sample.

A separate Windows process-registry smoke started two owned trees, released one owner, confirmed the other remained alive, and then stopped it independently. Linux CI covers the complete parent-death, foreground/background command, session-release, `/ps`, scheduled-task, and concurrency scenarios.

## Final cloud test totals

| Package or scenario | Result |
| --- | --- |
| custom | 6 passed |
| providers | 484 passed, 6 skipped |
| agent-core | 560 passed, 1 skipped |
| coding-agent | 5342 passed, 55 skipped |
| apps/cli | 762 passed |
| Standalone bundle smoke | Passed |
| Linux sandbox smoke | Passed: allowed write, denied write, and denied network |
| Production `npm audit` | Passed |

An earlier upstream-merge Test attempt had one asynchronous edit-render assertion and one 30-second runtime-context timeout; its rerun passed. The edit scenario now uses the existing bounded text wait. Both the 0.1.7 run `42152905961` and the lifecycle run `42573793593` passed their initial complete Test attempts. These records distinguish load-sensitive test behavior from current release evidence.

## Boundaries

The snapshot does not claim coverage for a real Bun runtime, macOS sandbox execution, unprivileged Linux sandbox setup on every distribution, production Step/Lark/remote MCP services, crash-durability semantics beyond existing tests, or performance improvements without a matched baseline.

For future changes, run the focused behavior tests first, then repeat the complete checks. A green historical report does not validate a newer commit.
