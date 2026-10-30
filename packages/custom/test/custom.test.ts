import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { atomicWriteFileSync } from "../src/atomic-file.ts";
import { mapWithConcurrency } from "../src/concurrency.ts";
import { configureCustom, DEFAULT_CUSTOM_CONFIG, resetCustomConfigForTests } from "../src/config.ts";
import { isModelCatalogStale } from "../src/model-catalog.ts";
import {
	createStreamingParseState,
	parseStreamingWithSchedule,
	shouldParseStreamingJson,
} from "../src/streaming-parse.ts";

const roots: string[] = [];
afterEach(() => {
	resetCustomConfigForTests();
	for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("custom primitives", () => {
	it("writes a readable replacement through the atomic helper", () => {
		const root = mkdtempSync(join(tmpdir(), "step-custom-"));
		roots.push(root);
		const path = join(root, "value.json");
		atomicWriteFileSync(path, JSON.stringify({ ok: true }));
		expect(JSON.parse(readFileSync(path, "utf8"))).toEqual({ ok: true });
	});

	it("preserves order and bounds concurrent operations", async () => {
		let active = 0;
		let peak = 0;
		const result = await mapWithConcurrency([1, 2, 3, 4, 5], 2, async (value) => {
			active++;
			peak = Math.max(peak, active);
			await new Promise((resolve) => setTimeout(resolve, 1));
			active--;
			return value * 2;
		});
		expect(result).toEqual([2, 4, 6, 8, 10]);
		expect(peak).toBeLessThanOrEqual(2);
	});

	it("throttles intermediate parses but always parses the final block", () => {
		configureCustom({ streamingParseIntervalMs: 100, streamingParseMinChars: 3 });
		const state = createStreamingParseState();
		expect(shouldParseStreamingJson(state, 3, false, 1000)).toBe(true);
		state.lastParsedAt = 1000;
		state.lastParsedLength = 3;
		expect(shouldParseStreamingJson(state, 6, false, 1001)).toBe(false);
		expect(shouldParseStreamingJson(state, 6, false, 1100)).toBe(true);
		expect(parseStreamingWithSchedule(state, "{}", (value) => JSON.parse(value ?? ""), true)).toEqual({});
	});

	it("uses TTL semantics for catalog freshness", () => {
		configureCustom({ modelCatalogTtlMs: 100 });
		expect(isModelCatalogStale(undefined, 1000)).toBe(true);
		expect(isModelCatalogStale(950, 1000)).toBe(false);
		expect(isModelCatalogStale(900, 1000)).toBe(true);
	});

	it("exposes stable defaults", () => {
		expect(DEFAULT_CUSTOM_CONFIG.findStatConcurrency).toBeGreaterThan(0);
		expect(DEFAULT_CUSTOM_CONFIG.sessionScanConcurrency).toBeGreaterThan(0);
	});
});
