# Step Code Custom documentation

Use this index for current product and maintenance documentation. Historical research notes remain in the repository for context, but they do not define current behavior.

## Start here

- [Project overview and installation](../README.md) — features, source installation, sign-in, examples, shortcuts, and verification.
- [中文项目说明](../README.zh-CN.md) — 项目特性、安装、使用示例与定制入口。
- [Step configuration files](step-configuration.md) — global and project TOML settings, credentials, permissions, environment variables, and runtime behavior.
- [Adaptive context management](context-management.md) — compaction ratios, per-model overrides, and response headroom.
- [Performance verification](performance.md) — reproducible startup, cache, and configuration measurements.
- [Verification evidence](verification.md) — latest upstream baseline, real entrypoint/RPC results, cloud test totals, and coverage boundaries.
- [Step Code 0.1.7 synchronization](release-0.1.7.md) — official release evidence and feature-by-feature source/test mapping.
- [Troubleshooting](troubleshooting.md) — installation, commands, CI, audits, and platform limitations.
- [Command permissions](command-permissions.md) — command matching and approval behavior.

## Customize and maintain

- [Customization guide](customization.md) — package boundaries, configuration defaults, JSON setup, and extension workflow.
- [Customization package contract](../packages/custom/README.md) — public entry points and merge constraints for `packages/custom`.
- [Upstream synchronization](upstream-sync.md) — remote layout, private commits, upstream merges, conflict review, and validation.
- [Development guide](development.md) — source-of-truth rules, coding conventions, ownership, and review practices.
- [Testing guide](testing.md) — selecting and interpreting validation.

## Runtime and workflow reference

- [Goal lifecycle](goal-lifecycle.md) — persistent objective behavior.
- [Plan approval](plan-approval.md) — plan-mode proposal and approval behavior.
- [Plan, loop, cron, and hands-off workflow](plan-loop-cron-workflow-hoh.md) — longer-running workflow semantics.
- [Orchestration lifecycle](orchestration-lifecycle.md) — multi-agent and background execution.
- [Completion checks](completion-check.md) — completion verification behavior.
- [Session compaction integrity](compaction-integrity.md) — compaction and session-state integrity.
- [TUI rendering pipeline](tui-rendering-pipeline.md) — terminal rendering behavior.
- [Runtime information](runtime-info.md) — runtime metadata and reporting.
- [Feishu/Lark connection](lark-connection.md) — optional external adapter configuration.

## Project policies

- [Architecture and module instructions](../AGENTS.md) — package responsibilities and dependency boundaries.
- [Contribution guide](../contribute.md) — downstream contribution workflow.
- [Security policy](../SECURITY.md) — security reporting and extension considerations.
- [Third-party provenance](THIRD_PARTY_PROVENANCE.md) — third-party source and provenance notes.
