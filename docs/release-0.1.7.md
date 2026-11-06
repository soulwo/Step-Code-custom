# Step Code 0.1.7 synchronization

This page maps the official 0.1.7 release notes to the downstream source and its verification. It prevents a green CI badge or an older `0.1.0` label from being mistaken for a complete release review.

## Official release evidence

- Official manifest: <https://static-openapi.stepfun.com/stepcode/0.1.7/manifest.json>
- Official Windows x64 archive SHA256: `a2b240e5f29cd096e221640854a7326966e1aa97e1ceb9f756c1712c77247402`
- The downloaded archive matched that checksum, and its `step.exe --version` returned `0.1.7`.
- The official binary's complete `--help` output was identical to the downstream build before the version-label update.

## Feature-by-feature review

| Release item | Current implementation and verification |
| --- | --- |
| Automatic compaction thresholds | `compaction.triggerRatio` supports global and per-model ratios from 0.50 through 0.95, response-room protection, and absolute limits. Covered by `compaction-trigger-policy.test.ts` and the configuration documentation. |
| Incremental long-reply rendering | `packages/tui/src/components/markdown.ts` caches rendered output, while stream-prefix/finality logic bounds recomputation. `markdown-invalidate`, `markdown-stream-work`, `markdown-stream-prefix`, `markdown-stream-finality`, and `markdown-block-math` all passed under the package's real Node test runner. |
| JSON/RPC log size | Live update frames are opt-in through `--include-live-events`; facts and final boundaries remain. Covered by `json-event-projection.test.ts` and JSON durability scenarios. |
| Compaction and branch summaries | Thinking blocks are omitted from replayed summary input while visible replies, tools, and diagnostics remain. Output budgets use model capability and remaining context. Covered by `compaction-serialization`, `compaction-summary-reasoning`, and `branch-summarization` tests. |
| Execution control | Plan mode is entered only by the user; `enter_plan_mode` is absent. Subagent guidance requires an explicit delegation request. Covered by capabilities, system-prompt, plan-extension, and subagent-description checks. |
| Plan approval | The reviewed plan version and user decision are enforced as session facts; cancellation is not approval and background work cannot bypass the gate. Covered by `plan-approval-gate`, `plan-handoff`, compaction, and queue tests. |
| Empty-response recovery | Incomplete turns receive bounded recovery and explicit terminal failure classification rather than false success. Covered by `incomplete-turn-recovery.test.ts` and provider/Agent Core tests. |
| Command outcomes | Exit code, timeout, signal, output, and tool-execution errors remain separate. Covered by `command-outcome` and `step-then-run-command-parity` tests. |
| Applied edit diffs after failure | Result details replace stale preview errors with the actual applied diff while retaining the failed command status. The scenario now uses the existing bounded text wait and passed with the assistant-message suite: 20/20. |
| Completed subagent results | Completed answers remain available across follow-up work, failures, and manual stops; current failure state is reported separately. Covered by lane notification, settled-lane/failure, and subagent event scenarios. |
| Absolute glob after startup-directory deletion | A real regression test exposed that Windows separators still bypassed the Step absolute-pattern split. `step/tool-profile.ts` now accepts both slash directions and preserves filesystem roots. The new deleted-startup/absolute-target scenario and the full tool-profile file pass 34/34. |

## Version and documentation updates

- The root package version is `0.1.7`.
- English and Chinese README badges and terminal descriptions use `0.1.7`.
- The terminal SVG uses `0.1.7` and the current `--plan-review-surface` help output.
- `CHANGELOG.md` has a dated 0.1.7 section covering the release items.
- [Verification evidence](verification.md) retains the full cloud test totals and coverage boundaries.

## Review boundary

This page does not claim that the downstream source was rebuilt from the official binary. It records that the official binary was checksum-verified and executed, the CLI contract matched, each release item was mapped to current source, and the downstream was then built and tested independently with its customizations retained.
