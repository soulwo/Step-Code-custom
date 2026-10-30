import { getCustomConfig } from "./config.ts";

export interface StreamingParseState {
	lastParsedAt: number;
	lastParsedLength: number;
}

export function createStreamingParseState(): StreamingParseState {
	return { lastParsedAt: 0, lastParsedLength: 0 };
}

export function shouldParseStreamingJson(
	state: StreamingParseState,
	nextLength: number,
	final = false,
	now = Date.now(),
): boolean {
	if (final || state.lastParsedLength === 0 || nextLength < state.lastParsedLength) return true;
	if (nextLength === state.lastParsedLength) return false;
	const config = getCustomConfig();
	if (config.streamingParseIntervalMs === 0) return true;
	return (
		now - state.lastParsedAt >= config.streamingParseIntervalMs &&
		nextLength - state.lastParsedLength >= config.streamingParseMinChars
	);
}

/** Parse only when the scheduler allows it; undefined means the previous parsed value remains usable. */
export function parseStreamingWithSchedule<T>(
	state: StreamingParseState,
	partial: string | undefined,
	parse: (value: string | undefined) => T,
	final = false,
): T | undefined {
	const length = partial?.length ?? 0;
	if (!shouldParseStreamingJson(state, length, final)) return undefined;
	const result = parse(partial);
	state.lastParsedAt = Date.now();
	state.lastParsedLength = length;
	return result;
}
