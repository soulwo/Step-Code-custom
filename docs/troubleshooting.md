# Troubleshooting

## Check the runtime first

```bash
node --version
corepack pnpm --version
git --version
```

The repository requires Node.js 22.19 or newer and pnpm 9.15.9. Use `corepack enable` if pnpm is not available.

## Installation or lifecycle-script problems

The documented source-install path disables lifecycle scripts:

```bash
pnpm install --ignore-scripts
pnpm run build:offline
```

If a previous installation attempt left inconsistent state, report the exact package manager version and error rather than deleting the lockfile. The lockfile is part of the reproducible build.

## Offline versus online builds

- `pnpm run build:offline` uses model data already stored in the repository and is the reproducible default.
- `pnpm run build` can download fresh model data and requires network access.

Do not treat a model-data download failure as a TypeScript build failure; identify which stage failed.

## `pnpm step` versus `step`

From a source checkout, use `pnpm step` in the repository root. The shorter `step` command refers to an installed CLI available on your `PATH`.

```bash
pnpm step --version
pnpm step --help
```

Running `step` outside the source repository does not use the checkout automatically.

## GitHub shows a red failure mark

Two workflows check different things:

- **CI** runs Build, Check, and Test.
- **npm audit** checks production dependencies against the current online advisory database, including on a schedule.

A new advisory can make the audit fail without any source change or CI regression. Reproduce the audit locally with:

```bash
pnpm audit --prod --audit-level moderate
```

Read the failing workflow log before changing code. Dependency advisories require compatible dependency and lockfile updates; test timeouts require the relevant test evidence.

## Windows test limitations

Some suites require Bash, Git, or symbolic-link creation permission. A symlink privilege failure is an environment limitation, not automatically a product defect. Run focused tests where possible and report the operating system, shell, privilege mode, and exact error separately from assertion failures.

## Credentials and local data

Configuration, credentials, sessions, and logs normally live under `~/.stepcode`. Do not delete this directory as a general repair step.

- Inspect login state with `step login status` or `step login status --json`.
- Use `/logout` to clear the Step credential.
- Remove credentials and private project content before sharing logs or issue reports.

## Lockfile contribution checks

Intentional dependency updates must preserve the repository's `min-release-age=2` setting and pass the lockfile review hook. If the hook requests confirmation, set `STEP_ALLOW_LOCKFILE_CHANGE=1` only after reviewing the dependency changes, then commit normally. Do not skip hooks or hand-edit generated lockfile entries.

## Still stuck?

Include `step --version`, the commit SHA, the exact command, the failing stage, and a sanitized error excerpt in an Issue. State whether the same problem occurs in CI, the production audit, or a focused local test.
