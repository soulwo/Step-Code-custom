import { execFileSync } from "node:child_process";
import { SandboxManager } from "@anthropic-ai/sandbox-runtime";

if (process.platform !== "linux" && process.platform !== "darwin") {
	console.log(`Sandbox smoke skipped on ${process.platform}`);
	process.exit(0);
}

const config = {
	network: {
		allowedDomains: [],
		deniedDomains: [],
		allowLocalBinding: false,
	},
	filesystem: {
		denyRead: [],
		allowWrite: [process.cwd()],
		denyWrite: [],
	},
};

try {
	if (!SandboxManager.checkDependencies()) {
		throw new Error("Sandbox runtime dependencies are unavailable");
	}
	await SandboxManager.initialize(config);
	if (!SandboxManager.isSandboxingEnabled()) {
		throw new Error("Sandbox initialization did not enable sandboxing");
	}
	const command = await SandboxManager.wrapWithSandbox(
		`"${process.execPath}" -e "console.log('sandbox command executed')"`,
	);
	execFileSync("/bin/bash", ["-c", command], { stdio: "inherit" });
	console.log("Sandbox initialization and execution passed");
} finally {
	await SandboxManager.reset();
}
