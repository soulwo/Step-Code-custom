export interface CustomConfig {
	/** Minimum time between intermediate parses of one streaming tool call. Zero preserves eager parsing. */
	streamingParseIntervalMs: number;
	/** Minimum new characters required before another intermediate parse. */
	streamingParseMinChars: number;
	/** Maximum concurrent metadata reads in find_files. */
	findStatConcurrency: number;
	/** Maximum concurrent project-directory scans. */
	sessionScanConcurrency: number;
	/** How long a downloaded model catalog may be used without blocking startup on a refresh. */
	modelCatalogTtlMs: number;
	/** Warning text fragments suppressed by the CLI. All other warnings pass through. */
	suppressedWarningPatterns: string[];
}

export const DEFAULT_CUSTOM_CONFIG: Readonly<CustomConfig> = Object.freeze({
	streamingParseIntervalMs: 24,
	streamingParseMinChars: 128,
	findStatConcurrency: 32,
	sessionScanConcurrency: 8,
	modelCatalogTtlMs: 300_000,
	suppressedWarningPatterns: ["SQLite"],
});

let activeConfig: CustomConfig = { ...DEFAULT_CUSTOM_CONFIG };
let loaded = false;

function nonNegativeInteger(value: unknown, fallback: number, name: string): number {
	if (value === undefined) return fallback;
	if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
		throw new Error(`Invalid custom config ${name}: expected a non-negative integer`);
	}
	return value;
}

function positiveInteger(value: unknown, fallback: number, name: string): number {
	const normalized = nonNegativeInteger(value, fallback, name);
	if (normalized < 1) throw new Error(`Invalid custom config ${name}: expected a positive integer`);
	return normalized;
}

function normalizeConfig(input: Partial<CustomConfig>): CustomConfig {
	const warningPatterns = input.suppressedWarningPatterns;
	if (
		warningPatterns !== undefined &&
		(!Array.isArray(warningPatterns) || warningPatterns.some((item) => typeof item !== "string"))
	) {
		throw new Error("Invalid custom config suppressedWarningPatterns: expected an array of strings");
	}
	return {
		streamingParseIntervalMs: nonNegativeInteger(
			input.streamingParseIntervalMs,
			DEFAULT_CUSTOM_CONFIG.streamingParseIntervalMs,
			"streamingParseIntervalMs",
		),
		streamingParseMinChars: positiveInteger(
			input.streamingParseMinChars,
			DEFAULT_CUSTOM_CONFIG.streamingParseMinChars,
			"streamingParseMinChars",
		),
		findStatConcurrency: positiveInteger(
			input.findStatConcurrency,
			DEFAULT_CUSTOM_CONFIG.findStatConcurrency,
			"findStatConcurrency",
		),
		sessionScanConcurrency: positiveInteger(
			input.sessionScanConcurrency,
			DEFAULT_CUSTOM_CONFIG.sessionScanConcurrency,
			"sessionScanConcurrency",
		),
		modelCatalogTtlMs: nonNegativeInteger(
			input.modelCatalogTtlMs,
			DEFAULT_CUSTOM_CONFIG.modelCatalogTtlMs,
			"modelCatalogTtlMs",
		),
		suppressedWarningPatterns: [...(warningPatterns ?? DEFAULT_CUSTOM_CONFIG.suppressedWarningPatterns)],
	};
}

/** Unified programmatic configuration entry for embedding hosts. */
export function configureCustom(config: Partial<CustomConfig> = {}): CustomConfig {
	activeConfig = normalizeConfig(config);
	loaded = true;
	return activeConfig;
}

export function getCustomConfig(): CustomConfig {
	if (!loaded) configureCustom();
	return activeConfig;
}

export function resetCustomConfigForTests(): void {
	activeConfig = { ...DEFAULT_CUSTOM_CONFIG };
	loaded = false;
}
