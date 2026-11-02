import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { SandboxManager } from "@anthropic-ai/sandbox-runtime";

if (process.platform !== "linux" && process.platform !== "darwin") {
	console.log(`Sandbox smoke skipped on ${process.platform}`);
	process.exit(0);
}

const allowedName = `.step-sandbox-smoke-${process.pid}`;
const allowedPath = join(process.cwd(), allowedName);
const deniedPath = join("/tmp", `step-sandbox-smoke-denied-${process.pid}`);
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
	const probe = `
const fs = require("node:fs");
const path = require("node:path");
const net = require("node:net");
let allowedWrite = false;
let deniedWrite = false;
try {
  fs.writeFileSync(path.join(process.cwd(), ${JSON.stringify(allowedName)}), "ok");
  allowedWrite = true;
} catch {}
try {
  fs.writeFileSync(${JSON.stringify(deniedPath)}, "blocked");
} catch {
  deniedWrite = true;
}
const deniedNetwork = await new Promise((resolve) => {
  const socket = net.createConnection({ host: "127.0.0.1", port: 9 });
  const finish = (result) => {
    socket.destroy();
    resolve(result);
  };
  socket.setTimeout(2000);
  socket.once("connect", () => finish(false));
  socket.once("timeout", () => finish(true));
  socket.once("error", () => finish(true));
});
console.log("SANDBOX_PROBE " + JSON.stringify({ allowedWrite, deniedWrite, deniedNetwork }));
if (!allowedWrite || !deniedWrite || !deniedNetwork) process.exitCode = 1;
`;
	const encodedProbe = Buffer.from(probe).toString("base64");
	const command = await SandboxManager.wrapWithSandbox(
		`"${process.execPath}" --input-type=module -e "await import('data:text/javascript;base64,${encodedProbe}')"`,
	);
	execFileSync("/bin/bash", ["-c", command], { stdio: "inherit" });
	console.log("Sandbox initialization and isolation effects passed");
} finally {
	await SandboxManager.reset();
	rmSync(allowedPath, { force: true });
	rmSync(deniedPath, { force: true });
}
