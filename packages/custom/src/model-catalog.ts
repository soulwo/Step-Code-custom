import { getCustomConfig } from "./config.ts";

export function isModelCatalogStale(
	checkedAt: number | undefined,
	now = Date.now(),
	ttlMs = getCustomConfig().modelCatalogTtlMs,
): boolean {
	return checkedAt === undefined || ttlMs === 0 || now - checkedAt >= ttlMs;
}
