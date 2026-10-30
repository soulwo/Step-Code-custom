/** Map in input order while bounding the number of active asynchronous operations. */
export async function mapWithConcurrency<T, R>(
	items: readonly T[],
	limit: number,
	operation: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
	if (!Number.isInteger(limit) || limit < 1) throw new Error("Concurrency limit must be a positive integer");
	const results = new Array<R>(items.length);
	let nextIndex = 0;
	const workerCount = Math.min(limit, items.length);
	const workers = Array.from({ length: workerCount }, async () => {
		while (true) {
			const index = nextIndex++;
			if (index >= items.length) return;
			results[index] = await operation(items[index]!, index);
		}
	});
	await Promise.all(workers);
	return results;
}
