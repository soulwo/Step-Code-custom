# Step Code Custom

<p align="center">
  <strong>English</strong> · <a href="README.zh-CN.md">简体中文</a>
</p>

**A privately maintained terminal coding assistant with isolated customization, reliable local state, and bounded runtime overhead.**

---

Step Code Custom is an independently maintained, private build of a terminal coding agent. It reads and modifies code, runs commands and tests, resumes sessions, and supports interactive or headless workflows. The original `step` command and existing configuration formats are preserved so current workflows continue to work.

This repository is owned and maintained at [soulwo/Step-Code-custom](https://github.com/soulwo/Step-Code-custom). It is not the upstream project's release page, and it does not publish official upstream installers.

## Why Step Code Custom

- **Complete coding loop** — inspect a repository, edit files, execute tools, and verify changes in an interactive TUI or with `step -p` for automation.
- **Step provider integration** — sign in with a Step Plan account or use a Step Platform API key, then select among the models returned by the active Step endpoint.
- **Long-running work** — delegate objectives with `/goal`, schedule work with `/cron`, and opt into multi-agent workflows with `/ultracode` or `/ultraloop`.
- **Extension ecosystem** — use MCP servers, Agent Skills, plugins, and compatible Claude Code extensions.
- **StepPage integration** — publish local pages through the existing StepPage integration when it is configured and available.
- **Isolated customization** — local policies and utilities live in `packages/custom` instead of being scattered through upstream modules.
- **Reliability and performance improvements** — atomic writes for important state files, bounded file and session I/O, throttled intermediate JSON parsing, and model-catalog caching with background refresh.

## Installation

The supported installation path for this private repository is from source. You need Git, Node.js 22.19 or newer, and pnpm 9.15.9.

```bash
git clone https://github.com/soulwo/Step-Code-custom.git
cd Step-Code-custom
corepack enable
pnpm install --ignore-scripts
pnpm run build:offline
pnpm step
```

The offline build uses the model data already included in the repository. To download fresh model data and perform an online build, run `pnpm run build` instead.

From the source tree, use `pnpm step` wherever an installed CLI would use `step`:

```bash
pnpm step --version
pnpm step --help
```

## Sign in to the Step provider

The default entrypoint exposes one built-in model provider: **Step (StepFun)**. These profiles select the service region and billing method; they are not separate providers.

| Profile | Credential | Billing |
| --- | --- | --- |
| Step Plan (CN, [platform.stepfun.com](https://platform.stepfun.com/step-plan)) | Browser OAuth with automatic refresh | Usage included with Mini / Plus / Pro / Max plans |
| Step Plan Oversea ([platform.stepfun.ai](https://platform.stepfun.ai/step-plan)) | Browser OAuth with automatic refresh | Usage included with Mini / Plus / Pro / Max plans |
| Step Platform (CN) | API key from [platform.stepfun.com/interface-key](https://platform.stepfun.com/interface-key) | Pay per request |
| Step Platform Oversea | API key from [platform.stepfun.ai/interface-key](https://platform.stepfun.ai/interface-key) | Pay per request |

Inside the TUI, `/login` opens the sign-in flow; from a shell, run `step login`. For API-key access, set `STEP_API_KEY=<your_step_api_key>`, enter the key in `/login`, or pass `--api-key <your_step_api_key>` to a headless run.

`/status` shows session and model status. Use `step login status` or `step login status --json` to check the credential. Stored credentials live in `~/.stepcode/auth.json`; `/logout` clears the Step credential. After sign-in, `/model` lists models discovered from the active endpoint. A fresh model catalog is loaded from cache at startup and refreshed in the background.

## Getting started

Change into a project directory:

```bash
cd /path/to/your/project
step
```

Describe the task in the TUI, or submit one at launch:

```bash
step -p "Inspect this project's structure and explain how to run it locally."
```

Run `/init` to generate an `AGENTS.md` project guide. An existing `CLAUDE.md` is used as-is.

| Entry | Command | Use case |
| --- | --- | --- |
| Interactive TUI | `step` | Exploring code, ongoing conversations, reviewing changes |
| Headless | `step -p "..."` | Scripts, CI, and batch jobs |

### Examples

Read-only inspection:

```text
Inspect the main execution path and test setup. Do not modify any files.
```

A change with verification:

```text
Review the current API error handling, fix the confirmed defects, and run the relevant tests.
```

Multi-agent execution for one turn:

```bash
step -p "ultracode: Review the API changes and verify the tests"
```

Session-wide workflow controls are available through `/ultracode on`, `/ultracode off`, `/ultracode status`, and `/ultracode help`. `/ultraloop` is an exact alias. Workflow availability still depends on host and tool permissions.

### Resume a session

```bash
step -c   # Continue the most recent session
step -r   # Browse session history and choose one
```

Inside the TUI, `/resume` finds previous sessions and `/hotkeys` lists shortcuts.

### Common shortcuts

| Key | Action |
| --- | --- |
| `Enter` | Send a message, or queue it while a response is streaming |
| `Shift+Enter` / `Ctrl+J` / `Alt+Enter` | Insert a newline |
| `@` | Reference a project file |
| `!command` | Run a shell command and provide its output to the model |
| `Shift+Tab` | Cycle permission mode |
| `Ctrl+O` | Toggle tool output |
| `Esc` | Interrupt the running task |

## Custom configuration

Local customization primitives are exposed through `@step-harness/custom` and `@step-harness/custom/node`. See [packages/custom/README.md](packages/custom/README.md) for the extension and merge contract.

For a local JSON configuration, set `STEPCODE_CUSTOM_CONFIG` to the file path before starting the CLI:

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

Set `streamingParseIntervalMs` to `0` for eager intermediate parsing, or `modelCatalogTtlMs` to `0` to force a startup catalog refresh.

## Migrate from other agents

- **MCP configuration** — supported Claude Code and Codex MCP configuration can be imported on first launch without modifying the source files or inlining secrets.
- **Plugins** — compatible Claude Code plugins can be managed through `/plugin`.
- **Project guides** — an existing `CLAUDE.md` remains usable; `/init` generates the equivalent `AGENTS.md`.

## Build and verification

After changing the source:

```bash
pnpm run build:offline
pnpm run check
./test.sh
```

The full test script isolates user credentials and temporary resources. Some platform-specific suites may require Bash, Git, or symlink permission on Windows; report environment limitations separately from code failures.

## Security

Permission tiers are **Ask**, **Approve for Me**, and **Full Access**, cycled with `Shift+Tab`. Review tool calls and use the least permissive mode suitable for the task. Read [SECURITY.md](SECURITY.md) before reporting a vulnerability or loading third-party extensions.

## Uninstall

For a source installation, close running sessions and remove the cloned repository. Local configuration, credentials, sessions, and logs are stored under `~/.stepcode`; remove that directory only when you no longer need them.

## Docs and community

- [Customization guide](packages/custom/README.md)
- [Development guide](docs/development.md)
- [Contribution guide](contribute.md)
- [Issues](https://github.com/soulwo/Step-Code-custom/issues)
- [Upstream repository](https://github.com/stepfun-ai/Step-Code), used only for tracking upstream changes

When filing an issue, include `step --version`, the commit SHA, reproduction steps, and the command used. Remove credentials and private project content first.

## License

Released under the MIT license; see [LICENSE](LICENSE).
