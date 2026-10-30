import { getCustomConfig } from "./config.ts";

/** Suppress only configured warning fragments and preserve every other process warning. */
export function installSelectiveWarningFilter(
	patterns: readonly string[] = getCustomConfig().suppressedWarningPatterns,
): void {
	const original = process.emitWarning.bind(process);
	process.emitWarning = ((warning: string | Error, ...args: unknown[]) => {
		const text = typeof warning === "string" ? warning : warning.message;
		if (patterns.some((pattern) => pattern && text.includes(pattern))) return;
		Reflect.apply(original, process, [warning, ...args]);
	}) as typeof process.emitWarning;
}
