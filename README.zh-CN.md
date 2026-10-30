# Step Code Custom

<p align="center">
  <a href="README.md">English</a> · <strong>简体中文</strong>
</p>

**独立维护的终端编程助手：定制代码隔离、本地状态可靠、运行开销可控。**

---

Step Code Custom 是一个独立维护的私有终端编程助手，支持代码阅读与修改、命令和测试执行、会话恢复，以及交互式和无界面两种使用方式。项目保留原有 `step` 命令和配置格式，现有工作流无需因本次定制而改变。

本仓库由 [soulwo/Step-Code-custom](https://github.com/soulwo/Step-Code-custom) 维护，不是上游项目的官方发布页，也不提供上游官方安装器。

## 项目特性

- **完整编程闭环**：在交互式 TUI 中检查仓库、修改文件、执行工具并验证结果，也可通过 `step -p` 用于自动化任务。
- **Step provider 接入**：支持 Step Plan 账号登录和 Step Platform API Key，并可切换当前 Step endpoint 返回的模型。
- **长任务与多代理**：通过 `/goal` 管理持续目标，通过 `/cron` 定时执行，通过 `/ultracode` 或 `/ultraloop` 启用多代理工作流。
- **扩展生态**：支持 MCP 服务器、Agent Skills、插件及兼容的 Claude Code 扩展。
- **StepPage 集成**：配置且服务可用时，沿用现有 StepPage 能力发布本地页面。
- **定制逻辑隔离**：本地策略和工具集中在 `packages/custom`，避免散落在上游核心模块。
- **可靠性与性能改进**：关键状态原子写入、文件与会话 I/O 限流、流式 JSON 中间解析限频，以及模型目录缓存和后台刷新。

## 安装

本私有仓库目前通过源码安装。需要 Git、Node.js 22.19 或更高版本，以及 pnpm 9.15.9。

```bash
git clone https://github.com/soulwo/Step-Code-custom.git
cd Step-Code-custom
corepack enable
pnpm install --ignore-scripts
pnpm run build:offline
pnpm step
```

离线构建使用仓库已有的模型数据。需要下载最新模型数据时，改用 `pnpm run build`。

在源码目录中，将安装版命令里的 `step` 替换为 `pnpm step`：

```bash
pnpm step --version
pnpm step --help
```

## 登录 Step provider

默认入口内置一个模型 provider：**Step（StepFun）**。以下入口只代表不同区域和计费方式，不是不同 provider。

| 入口 | 鉴权方式 | 计费 |
| --- | --- | --- |
| Step Plan（国内，[platform.stepfun.com](https://platform.stepfun.com/step-plan)） | 浏览器 OAuth，凭据自动刷新 | Mini / Plus / Pro / Max 订阅内含用量 |
| Step Plan Oversea（海外，[platform.stepfun.ai](https://platform.stepfun.ai/step-plan)） | 浏览器 OAuth，凭据自动刷新 | Mini / Plus / Pro / Max 订阅内含用量 |
| Step Platform（国内） | 从 [platform.stepfun.com/interface-key](https://platform.stepfun.com/interface-key) 获取 API Key | 按请求计费 |
| Step Platform Oversea（海外） | 从 [platform.stepfun.ai/interface-key](https://platform.stepfun.ai/interface-key) 获取 API Key | 按请求计费 |

在 TUI 中输入 `/login` 启动登录流程，也可在 shell 中运行 `step login`。使用 API Key 时，可设置 `STEP_API_KEY=<your_step_api_key>`、在 `/login` 中输入，或在无界面运行时传入 `--api-key <your_step_api_key>`。

`/status` 用于查看会话和模型状态；`step login status` 或 `step login status --json` 用于检查凭据。凭据保存在 `~/.stepcode/auth.json`，`/logout` 用于清除。登录后，`/model` 显示当前 endpoint 返回的模型。新鲜模型目录在启动时直接使用，并在后台刷新。

## 上手

进入项目目录：

```bash
cd /path/to/your/project
step
```

在 TUI 中描述任务，或启动时直接提交：

```bash
step -p "检查这个项目的结构，并说明如何在本地运行。"
```

使用 `/init` 生成 `AGENTS.md` 项目指引；已有 `CLAUDE.md` 可直接使用。

| 入口 | 命令 | 适用场景 |
| --- | --- | --- |
| 交互式 TUI | `step` | 探索代码、持续对话、审阅修改 |
| 无界面 | `step -p "..."` | 脚本、CI 和批处理 |

### 示例

只读检查：

```text
检查主要执行链和测试结构，不要修改任何文件。
```

修改并验证：

```text
检查当前 API 错误处理，修复已确认的问题，并运行相关测试。
```

单轮多代理执行：

```bash
step -p "ultracode: Review the API changes and verify the tests"
```

会话级工作流可使用 `/ultracode on`、`/ultracode off`、`/ultracode status` 和 `/ultracode help` 控制；`/ultraloop` 是等价别名。工作流是否可用仍取决于宿主和工具权限。

### 恢复会话

```bash
step -c   # 继续最近一次会话
step -r   # 浏览历史会话并选择
```

TUI 内使用 `/resume` 查找历史会话，使用 `/hotkeys` 查看快捷键。

### 常用快捷键

| 快捷键 | 操作 |
| --- | --- |
| `Enter` | 发送消息；流式输出时排队 |
| `Shift+Enter` / `Ctrl+J` / `Alt+Enter` | 换行 |
| `@` | 引用项目文件 |
| `!命令` | 执行 Shell 命令并将输出提供给模型 |
| `Shift+Tab` | 循环权限模式 |
| `Ctrl+O` | 折叠或展开工具输出 |
| `Esc` | 中断当前任务 |

## 自定义配置

本地定制能力通过 `@step-harness/custom` 和 `@step-harness/custom/node` 提供，扩展与合并约定见 [packages/custom/README.md](packages/custom/README.md)。

使用 JSON 配置时，在启动前将 `STEPCODE_CUSTOM_CONFIG` 指向配置文件：

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

将 `streamingParseIntervalMs` 设为 `0` 可恢复每个中间块都解析；将 `modelCatalogTtlMs` 设为 `0` 可强制启动时刷新模型目录。

## 从其他 Agent 迁移

- **MCP 配置**：可导入支持的 Claude Code 和 Codex MCP 配置，不修改源文件，也不把密钥内联。
- **插件**：兼容的 Claude Code 插件可通过 `/plugin` 管理。
- **项目指引**：已有 `CLAUDE.md` 可直接使用，`/init` 可生成对应的 `AGENTS.md`。

## 构建与验证

修改源码后运行：

```bash
pnpm run build:offline
pnpm run check
./test.sh
```

完整测试脚本会隔离用户凭据和临时资源。Windows 下部分测试可能需要 Bash、Git 或 symlink 权限；环境限制应与代码失败分别报告。

## 安全

权限分为 **Ask**、**Approve for Me** 和 **Full Access**，通过 `Shift+Tab` 切换。请审阅工具调用，并选择满足任务需要的最低权限。加载第三方扩展或报告漏洞前，请阅读 [SECURITY.md](SECURITY.md)。

## 卸载

源码安装可直接删除克隆目录，删除前请关闭正在运行的会话。配置、凭据、会话和日志默认位于 `~/.stepcode`；只有确认不再需要这些数据时，才删除该目录。

## 文档与社区

- [定制指南](packages/custom/README.md)
- [开发指南](docs/development.md)
- [贡献指南](contribute.md)
- [问题反馈](https://github.com/soulwo/Step-Code-custom/issues)
- [上游仓库](https://github.com/stepfun-ai/Step-Code)，仅用于跟踪上游更新

提交 Issue 时，请附上 `step --version`、提交 SHA、复现步骤和运行命令，并先删除凭据和私人项目内容。

## 许可

本项目以 MIT 许可发布，详见 [LICENSE](LICENSE)。
