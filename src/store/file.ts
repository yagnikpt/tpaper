import fs from "node:fs";
import path from "node:path";
import envPaths from "env-paths";
import matter from "gray-matter";
import type { Block } from "@/types";

const paths = envPaths("dblocks", { suffix: "cli" });

function ensureAppDir(inner?: string) {
	const finalPath = inner ? path.join(paths.data, inner) : paths.data;
	try {
		if (!fs.existsSync(finalPath)) {
			fs.mkdirSync(finalPath, { recursive: true });
		}
	} catch (e) {
		throw new Error(`Failed to create app directory: ${e}`);
	}
}

function writeBlockFile(buffer: string, block: Block) {
	ensureAppDir(buffer);
	const blockPath = path.join(paths.data, buffer, `${block.title}.md`);
	const { content, ...meta } = block;
	try {
		fs.writeFileSync(blockPath, matter.stringify(content, meta));
	} catch (e) {
		throw new Error(`Failed to create block file: ${e}`);
	}
	return blockPath;
}

function getBuffers() {
	if (!fs.existsSync(paths.data)) {
		return [] as string[];
	}

	try {
		return fs
			.readdirSync(paths.data, { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name)
			.sort((a, b) => a.localeCompare(b));
	} catch {
		return [] as string[];
	}
}

function getBufferMarkdownFiles(buffer: string) {
	const bufferPath = path.join(paths.data, buffer);

	if (!fs.existsSync(bufferPath)) {
		return [] as string[];
	}

	try {
		return fs
			.readdirSync(bufferPath, { withFileTypes: true })
			.filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
			.map((entry) => entry.name)
			.sort((a, b) => a.localeCompare(b));
	} catch {
		return [] as string[];
	}
}

function walkBufferMarkdownFiles() {
	const buffers = getBuffers();
	const filesByBuffer = Object.fromEntries(
		buffers.map((buffer) => [buffer, getBufferMarkdownFiles(buffer)]),
	) as Record<string, string[]>;

	return { buffers, filesByBuffer };
}

export {
	ensureAppDir,
	getBufferMarkdownFiles,
	getBuffers,
	walkBufferMarkdownFiles,
	writeBlockFile,
};
