import { randomUUID } from "node:crypto";
import { closeSync, fsyncSync, openSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

export interface AtomicWriteOptions {
	encoding?: BufferEncoding;
	mode?: number;
}

/** Write through a same-directory temporary file, then atomically replace the destination. */
export function atomicWriteFileWithSync(
	path: string,
	write: (descriptor: number) => void,
	options: AtomicWriteOptions = {},
): void {
	const temporary = join(dirname(path), `.${basename(path)}.${process.pid}.${randomUUID()}.tmp`);
	let descriptor: number | undefined;
	try {
		descriptor = openSync(temporary, "wx", options.mode ?? 0o600);
		write(descriptor);
		fsyncSync(descriptor);
		closeSync(descriptor);
		descriptor = undefined;
		renameSync(temporary, path);
	} catch (error) {
		if (descriptor !== undefined) closeSync(descriptor);
		rmSync(temporary, { force: true });
		throw error;
	}
}

/** Replace a file atomically without exposing a truncated destination to readers or a crash. */
export function atomicWriteFileSync(
	path: string,
	data: string | NodeJS.ArrayBufferView,
	options: AtomicWriteOptions = {},
): void {
	const encoding = options.encoding ?? "utf8";
	atomicWriteFileWithSync(path, (descriptor) => writeFileSync(descriptor, data, { encoding }), options);
}
