# Security Policy

Step Code Custom is a locally running coding agent. It operates with the permissions of the user who starts it, so users should review tool calls and, when appropriate, run it inside a container, virtual machine, or other sandbox.

The local user account, writable project files, and the Step Code Custom process belong to the same general trust boundary. An attacker who can already modify the user's workspace, shell startup files, environment, or configuration can often influence local developer tools. Reports that require this prior local access must also demonstrate a distinct privilege-boundary violation in this project.

Only install trustworthy extensions and skills, and use the agent in repositories whose instructions you trust. Files such as `AGENTS.md`, source comments, and extension instructions can influence model behavior and tool calls.

## Reporting a vulnerability

Report security-sensitive issues privately through [GitHub Security Advisories](https://github.com/soulwo/Step-Code-custom/security/advisories) for `soulwo/Step-Code-custom`. Do not post credentials, private repository content, or exploit details in a public issue.

Include:

- A description of the issue and its impact
- Reproduction steps, proof of concept, or relevant logs
- The affected package, version, commit SHA, and configuration
- Any known mitigation

## Scope

Security defects in this repository's command-line tools, APIs, customization layer, and distributed source are in scope.

Out of scope examples include:

- Expected local code execution or tool use approved by the user
- Malicious extensions, skills, repositories, or model output supplied by the user
- Prompt injection without a separate security-boundary bypass
- Third-party credentials already exposed by the user
- Reports that only require modification of user-controlled local state
- Denial-of-service scenarios driven solely by trusted local input
- Vulnerabilities that belong exclusively to the upstream Step service or another third party

Useful reports identify a current, reproducible boundary violation with demonstrated impact. Include the exact affected path and commit, and explain why the behavior differs from the user's approved action.
