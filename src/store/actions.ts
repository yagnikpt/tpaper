import { randomUUIDv7 } from "bun";
import {
	createBufferDir,
	deleteBlockFile,
	deleteBufferDir,
	readBlockFileByPath,
	renameBufferDir,
	walkBufferFiles,
	writeBlockFile,
} from "@/store/file";
import type { Block } from "@/types";
import { sortBlocksDesc } from "@/utils";
import { DEFAULT_BUFFER } from "@/utils/contants";

function createNewBuffer(name: string, allBuffers: Record<string, Block[]>) {
	const nextName = name.trim();
	if (!nextName) return false;

	if (allBuffers[nextName]) {
		return false;
	}

	const created = createBufferDir(nextName);
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

	const deleted = deleteBufferDir(target);
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

	const renamed = renameBufferDir(current, next);
	if (!renamed) {
		return false;
	}

	return next;
}

function createNewBlock(buffer: string, title: string) {
	const block = {
		id: randomUUIDv7(),
		title: title,
		content: "",
	};
	writeBlockFile(buffer, block);
	return block;
}

function writeBlock(buffer: string, block: Block) {
	writeBlockFile(buffer, block);
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

	deleteBlockFile(buffer, block.title);
	const updatedBlock: Block = {
		...block,
		title: nextTitle,
	};
	writeBlockFile(buffer, updatedBlock);
	return updatedBlock;
}

function deleteBlock(buffer: string, block: Block) {
	deleteBlockFile(buffer, block.title);
}

function loadInitialStore() {
	const { filesByBuffer } = walkBufferFiles();
	const buffers: Record<string, Block[]> = {};

	for (const buffer in filesByBuffer) {
		const filePaths = filesByBuffer[buffer];
		const blocks: Block[] = [];
		for (const blockPath of filePaths ?? []) {
			const block = readBlockFileByPath(blockPath);
			blocks.push(block);
		}
		const sortedBlocks = sortBlocksDesc(blocks);
		buffers[buffer] = sortedBlocks;
	}

	let activeBuffer = DEFAULT_BUFFER;
	if (Object.keys(buffers).length) {
		activeBuffer = Object.keys(buffers)[0] as string;
	} else {
		buffers[DEFAULT_BUFFER] = [];
	}

	return { buffers, activeBuffer };
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
