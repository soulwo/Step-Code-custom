# Contributing to Step Code Custom

Step Code Custom is maintained privately at [soulwo/Step-Code-custom](https://github.com/soulwo/Step-Code-custom). Changes should be focused, verified, and compatible with existing CLI arguments, persisted sessions, and extension interfaces.

## Project resources

- [Private repository](https://github.com/soulwo/Step-Code-custom)
- [Issues](https://github.com/soulwo/Step-Code-custom/issues)
- [Development guide](docs/development.md)
- [Customization guide](packages/custom/README.md)
- [Security policy](SECURITY.md)

## Development workflow

1. Start from the latest `main` and create a focused working branch.
2. Read the root [AGENTS.md](AGENTS.md) and any `AGENTS.md` files in the affected directories.
3. Keep unrelated refactoring out of the change. Add or update tests and documentation when behavior changes.
4. Put new local policies and utilities in `packages/custom`; upstream files should contain only the minimum integration code.
5. Use clear commit messages and keep the Git author identity accurate. Do not commit credentials, private project data, or generated test artifacts.

## Validation

Run the focused tests for the affected area, then run from the repository root:

```bash
pnpm run build:offline
pnpm run check
./test.sh
```

The offline build is the default verification path because it does not depend on downloading model data. The full test script isolates user credentials and temporary resources. On Windows, some unrelated suites may require Bash, Git, or symlink permission; document those environment failures rather than claiming that every test passed.

## Upstream synchronization

The `origin` remote tracks `stepfun-ai/Step-Code`; the `custom` remote tracks this private repository. After merging upstream changes, review the customization call sites, run the build and checks, and push the result to `custom/main`. Do not replace `packages/custom` blindly with upstream content.

## Reporting issues and security problems

Use the repository issue tracker for reproducible bugs or focused proposals. Include `step --version`, the commit SHA, reproduction steps, and exact validation output. Report security-sensitive issues privately according to [SECURITY.md](SECURITY.md), without posting credentials or private project content.
