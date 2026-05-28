import fs from "node:fs";
import path from "node:path";
import envPaths from "env-paths";
import type { Block } from "@/types";

const paths = envPaths("tpaper", { suffix: "cli" });

const DATA_DIR = paths.data;

const BLOCK_DELIMITER_REGEX =
	/<!--\s*BLOCK\s+uuid="([^"]+)"\s+title="([^"]*)"\s*-->/g;

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

function escapeAttr(value: string) {
	return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function unescapeAttr(value: string) {
	return value.replaceAll("&quot;", '"').replaceAll("&amp;", "&");
}

function getBufferFilePath(buffer: string) {
	return path.join(paths.data, `${buffer}.md`);
}

function serializeBlocks(blocks: Block[]) {
	return blocks
		.map(
			(block) =>
				`<!-- BLOCK uuid="${escapeAttr(block.id)}" title="${escapeAttr(block.title)}" -->\n${block.content}`,
		)
		.join("\n");
}

function parseBlocks(content: string): Block[] {
	const blocks: Block[] = [];
	const matches = [...content.matchAll(BLOCK_DELIMITER_REGEX)];

	for (const [i, match] of matches.entries()) {
		const nextMatch = matches[i + 1];
		const id = unescapeAttr(match[1] ?? "");
		const title = unescapeAttr(match[2] ?? "");
		const contentStart = match.index + match[0].length;
		const contentEnd = nextMatch?.index ?? content.length;
		let blockContent = content.slice(contentStart, contentEnd);
		if (blockContent.startsWith("\n")) {
			blockContent = blockContent.slice(1);
		}
		if (i < matches.length - 1 && blockContent.endsWith("\n")) {
			blockContent = blockContent.slice(0, -1);
		}

		blocks.push({ id, title, content: blockContent });
	}

	return blocks;
}

function writeBufferFile(buffer: string, blocks: Block[]) {
	ensureAppDir();
	const bufferPath = getBufferFilePath(buffer);
	const tempPath = `${bufferPath}.tmp`;

	try {
		const content = serializeBlocks(blocks);
		fs.writeFileSync(tempPath, content, "utf-8");
		fs.renameSync(tempPath, bufferPath);
	} catch (e) {
		if (fs.existsSync(tempPath)) {
			fs.rmSync(tempPath, { force: true });
		}
		throw new Error(`Failed to write buffer file: ${e}`);
	}

	return bufferPath;
}

function readBufferFile(buffer: string): Block[] {
	const bufferPath = getBufferFilePath(buffer);
	if (!fs.existsSync(bufferPath)) return [];

	const content = fs.readFileSync(bufferPath, "utf-8");
	return parseBlocks(content);
}

function createBufferFile(name: string) {
	const buffer = name.trim();
	if (!buffer) return false;

	const bufferPath = getBufferFilePath(buffer);
	if (fs.existsSync(bufferPath)) {
		return false;
	}

	try {
		writeBufferFile(buffer, []);
		return true;
	} catch {
		return false;
	}
}

function deleteBufferFile(name: string) {
	const buffer = name.trim();
	if (!buffer) return false;

	const bufferPath = getBufferFilePath(buffer);
	if (!fs.existsSync(bufferPath)) {
		return false;
	}

	try {
		fs.rmSync(bufferPath, { force: true });
		return true;
	} catch {
		return false;
	}
}

function renameBufferFile(currentName: string, nextName: string) {
	const current = currentName.trim();
	const next = nextName.trim();
	if (!current || !next) return false;
	if (current === next) return true;

	const currentPath = getBufferFilePath(current);
	const nextPath = getBufferFilePath(next);

	if (!fs.existsSync(currentPath) || fs.existsSync(nextPath)) {
		return false;
	}

	try {
		fs.renameSync(currentPath, nextPath);
		return true;
	} catch {
		return false;
	}
}

function getBuffers() {
	if (!fs.existsSync(paths.data)) {
		return [] as string[];
	}

	try {
		return fs
			.readdirSync(paths.data, { withFileTypes: true })
			.filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
			.map((entry) => entry.name.slice(0, -3))
			.sort((a, b) => a.localeCompare(b));
	} catch {
		return [] as string[];
	}
}

function getBufferFiles(buffer: string) {
	const bufferPath = getBufferFilePath(buffer);
	if (!fs.existsSync(bufferPath)) {
		return [] as string[];
	}
	return [bufferPath];
}

function walkBufferFiles() {
	const buffers = getBuffers();
	const filesByBuffer = Object.fromEntries(
		buffers.map((buffer) => [buffer, getBufferFiles(buffer)]),
	) as Record<string, string[]>;

	return { buffers, filesByBuffer };
}

export {
	createBufferFile,
	DATA_DIR,
	deleteBufferFile,
	ensureAppDir,
	getBufferFilePath,
	getBufferFiles,
	getBuffers,
	readBufferFile,
	renameBufferFile,
	walkBufferFiles,
	writeBufferFile,
};
