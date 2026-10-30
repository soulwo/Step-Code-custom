import { readFileSync } from "node:fs";
import { type CustomConfig, configureCustom } from "./config.ts";

/** Load the optional JSON file named by STEPCODE_CUSTOM_CONFIG in a Node host. */
export function loadCustomConfig(env: NodeJS.ProcessEnv = process.env): CustomConfig {
	const path = env.STEPCODE_CUSTOM_CONFIG?.trim();
	if (!path) return configureCustom();
	const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
		throw new Error(`Invalid custom config ${path}: expected a JSON object`);
	}
	return configureCustom(parsed as Partial<CustomConfig>);
}
