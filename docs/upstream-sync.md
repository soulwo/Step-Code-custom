# Upstream synchronization guide

This repository is a private downstream build of [`stepfun-ai/Step-Code`](https://github.com/stepfun-ai/Step-Code). Two Git remotes keep upstream tracking and private development separate.

| Remote | Repository | Purpose |
| --- | --- | --- |
| `origin` | `https://github.com/stepfun-ai/Step-Code.git` | Fetch upstream changes |
| `custom` | `https://github.com/soulwo/Step-Code-custom.git` | Push private downstream changes |

Confirm the mapping with:

```bash
git remote -v
git status --short --branch
```

## Publish local changes

Run the relevant verification first, then create a normal commit and push it to the private repository:

```bash
git add -A
git commit -m "Describe the change"
git push custom main
```

Do not push private commits to `origin`.

## Merge a new upstream version

Start with a clean working tree. Fetch and merge upstream into the local `main` branch:

```bash
git fetch origin
git merge origin/main
```

If Git reports conflicts, resolve them before continuing. Review these areas especially carefully:

- `packages/custom`: preserve the isolated customization package and its browser-safe/Node-only split.
- `apps/cli`: preserve startup configuration loading and selective warning filtering.
- `packages/coding-agent`: preserve atomic state writes, bounded I/O, and model-catalog freshness behavior.
- `packages/providers`: preserve throttled intermediate parsing and mandatory final parsing.
- Workspace registration: retain the custom package in `package.json`, `pnpm-lock.yaml`, TypeScript paths, Vitest aliases, and `scripts/workspace-registry.json`.

After resolving conflicts:

```bash
git add -A
git commit --no-edit
```

Install from the updated lockfile and verify the combined tree:

```bash
pnpm install --frozen-lockfile --ignore-scripts
pnpm run build:offline
pnpm run check
```

Run focused tests for any behavior touched by the merge. Once the combined tree is verified, publish it only to the private remote:

```bash
git push custom main
```

To abandon a merge before committing it:

```bash
git merge --abort
```

## Merge rules

- Prefer upstream improvements to shared logic, then reconnect local policy through `packages/custom`.
- Do not maintain two competing implementations of the same behavior in an upstream module and the custom package.
- Do not replace `packages/custom` wholesale with upstream content.
- Treat build or test success before the merge as historical information; verify the merged tree again.
- Keep private project details, credentials, and machine-specific configuration out of commits.
