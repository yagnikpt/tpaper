import { randomUUIDv7 } from "bun";
import { loadConfig } from "@/config";
import {
	createBufferFile,
	deleteBufferFile,
	getBuffers,
	readBufferFile,
	renameBufferFile,
	writeBufferFile,
} from "@/storage/fs";
import type { Block } from "@/types";
import { DEFAULT_BUFFER } from "@/utils/contants";

function createNewBuffer(name: string, allBuffers: Record<string, Block[]>) {
	const nextName = name.trim();
	if (!nextName) return false;

	if (allBuffers[nextName]) {
		return false;
	}

	const created = createBufferFile(nextName);
	if (!created) {
		return false;
	}

	return nextName;
}

function deleteBuffer(name: string, allBuffers: Record<string, Block[]>) {
	const target = name.trim();
	if (!target) return false;

	if (!allBuffers[target]) {
		return false;
	}

	const deleted = deleteBufferFile(target);
	if (!deleted) {
		return false;
	}

	return target;
}

function renameBuffer(
	currentName: string,
	nextName: string,
	allBuffers: Record<string, Block[]>,
) {
	const current = currentName.trim();
	const next = nextName.trim();
	if (!current || !next) return false;

	if (!allBuffers[current]) {
		return false;
	}

	if (current === next) {
		return next;
	}

	if (allBuffers[next]) {
		return false;
	}

	const renamed = renameBufferFile(current, next);
	if (!renamed) {
		return false;
	}

	return next;
}

function createNewBlock(buffer: string, title: string, allBlocks: Block[]) {
	const block = {
		id: randomUUIDv7(),
		title: title,
		content: "",
	};
	writeBufferFile(buffer, [...allBlocks, block]);
	return block;
}

function writeBlock(buffer: string, block: Block, allBlocks: Block[]) {
	const existingIndex = allBlocks.findIndex((b) => b.id === block.id);
	const nextBlocks = [...allBlocks];

	if (existingIndex === -1) {
		nextBlocks.push(block);
	} else {
		nextBlocks[existingIndex] = block;
	}

	writeBufferFile(buffer, nextBlocks);
	return block;
}

function renameBlockTitle(
	buffer: string,
	allBlocks: Block[],
	block: Block,
	title: string,
) {
	const nextTitle = title.trim();
	if (!nextTitle) return false;

	if (block.title === nextTitle) {
		return block;
	}

	const duplicate = allBlocks.find(
		(b) => b.id !== block.id && b.title === nextTitle,
	);
	if (duplicate) {
		throw new Error(`DUPLICATE_TITLE`);
	}

	const updatedBlock: Block = {
		...block,
		title: nextTitle,
	};
	const nextBlocks = allBlocks.map((b) =>
		b.id === updatedBlock.id ? updatedBlock : b,
	);
	writeBufferFile(buffer, nextBlocks);
	return updatedBlock;
}

function deleteBlock(buffer: string, block: Block, allBlocks: Block[]) {
	const nextBlocks = allBlocks.filter((b) => b.id !== block.id);
	writeBufferFile(buffer, nextBlocks);
}

function loadInitialStore() {
	const config = loadConfig();

	const bufferNames = getBuffers();
	const buffers: Record<string, Block[]> = {};

	for (const bufferName of bufferNames) {
		buffers[bufferName] = readBufferFile(bufferName);
	}

	let activeBuffer: string;
	if (!Object.keys(buffers).length) {
		// No buffers on disk — start fresh with the default
		buffers[DEFAULT_BUFFER] = [];
		activeBuffer = DEFAULT_BUFFER;
	} else if (buffers[config.lastActiveBuffer] !== undefined) {
		// Restore the previously active buffer
		activeBuffer = config.lastActiveBuffer;
	} else {
		// Saved buffer no longer exists — fall back to first available
		activeBuffer = Object.keys(buffers)[0] as string;
	}

	return { buffers, activeBuffer, config };
}

export {
	createNewBlock,
	createNewBuffer,
	deleteBlock,
	deleteBuffer,
	loadInitialStore,
	renameBlockTitle,
	renameBuffer,
	writeBlock,
};
