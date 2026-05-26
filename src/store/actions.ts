import { randomUUIDv7 } from "bun";
import { setStore, store } from "@/store";
import {
	readBlockFileByPath,
	walkBufferFiles,
	writeBlockFile,
} from "@/store/file";
import type { Block, Buffer } from "@/types";
import { sortBlocksDesc } from "@/utils";
import { DEFAULT_BUFFER } from "@/utils/contants";

function createNewBlock(buffer: string, title: string) {
	const block = {
		id: randomUUIDv7(),
		title: title,
		content: "",
	};
	writeBlockFile(buffer, block);
	setStore("buffers", buffer, () => [
		...(store.buffers[buffer] as Buffer),
		block,
	]);
	return block;
}

function writeBlock(buffer: string, block: Block) {
	writeBlockFile(buffer, block);
	const sorted = sortBlocksDesc([
		...(store.buffers[buffer]?.filter((b) => b.id !== block.id) as Buffer),
		block,
	]);
	setStore("buffers", buffer, () => sorted);
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

export { createNewBlock, loadInitialStore, writeBlock };
