# Verification evidence

This page records the latest verified downstream state. It is a dated snapshot, not a replacement for the live CI badges or the checks required for future changes.

## Current baseline

- Downstream merge: `db1e4f2`
- Upstream baseline: `29eb460` (`recover incomplete assistant turns`)
- Branch relationship after the merge: 20 downstream commits ahead, 0 upstream commits behind.
- Main CI: [run 42007053636](https://github.com/soulwo/Step-Code-custom/actions/runs/42007053636)
- Production dependency audit: [run 42007179104](https://github.com/soulwo/Step-Code-custom/actions/runs/42007179104)

## Upstream behavior reviewed

- Command exit status, timeout, signal, and output remain distinct from tool-execution errors.
- Plan decisions persist as session facts across queueing, recovery, and compaction.
- An edit call that fails after modifying a file still exposes the applied diff.
- The withdrawn ambient-warning footer badge is not retained in the downstream.
- Incomplete assistant turns have explicit recovery behavior across persistence, print/JSON/RPC, background work, and subagents.

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

Actual entrypoint checks returned `0.1.0` for the source CLI, `apps/cli/dist/main.js`, and `packages/coding-agent/dist/bundle/step.js`. The standalone bundle also completed `--help` and a real RPC `get_state` request. RPC startup succeeded for both bundled and unbundled Node entrypoints.

The terminal illustration is selected from the final bundle's real `--help` output. It includes the current `--plan-review-surface` RPC option rather than an obsolete command sample.

## Final cloud test totals

| Package or scenario | Result |
| --- | --- |
| custom | 6 passed |
| providers | 481 passed, 6 skipped |
| agent-core | 560 passed, 1 skipped |
| coding-agent | 5274 passed, 55 skipped |
| apps/cli | 762 passed |
| Standalone bundle smoke | Passed |
| Linux sandbox smoke | Passed: allowed write, denied write, and denied network |
| Production `npm audit` | Passed |

An initial cloud Test attempt had one asynchronous edit-render assertion and one 30-second runtime-context timeout. Focused local reruns passed, and the complete cloud job passed on rerun. This is recorded as load-sensitive test behavior, not hidden or converted into a first-attempt success.

## Boundaries

The snapshot does not claim coverage for a real Bun runtime, macOS sandbox execution, unprivileged Linux sandbox setup on every distribution, production Step/Lark/remote MCP services, crash-durability semantics beyond existing tests, or performance improvements without a matched baseline.

For future changes, run the focused behavior tests first, then repeat the complete checks. A green historical report does not validate a newer commit.
