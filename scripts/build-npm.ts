import path from "node:path";
import solidPlugin from "@opentui/solid/bun-plugin";
import type { BunPlugin } from "bun";

const VERSION = process.env.VERSION;

const wasmPath = path.resolve(
	import.meta.dirname,
	"node_modules/web-tree-sitter/web-tree-sitter.wasm",
);
const parserWorker = path.resolve(
	"node_modules/@opentui/core/parser.worker.js",
);

const fixTreeSitterWasm: BunPlugin = {
	name: "fix-tree-sitter-wasm",
	setup(build) {
		build.onResolve({ filter: /web-tree-sitter\/tree-sitter\.wasm$/ }, () => ({
			path: "tree-sitter-wasm-path",
			namespace: "virtual",
		}));
		build.onLoad({ filter: /.*/, namespace: "virtual" }, () => ({
			contents: `export default ${JSON.stringify(wasmPath)};`,
			loader: "js",
		}));
	},
};

const parserResult = await Bun.build({
	entrypoints: [parserWorker],
	outdir: "dist",
	target: "bun",
	format: "esm",
	naming: "parser.worker.js",
	plugins: [fixTreeSitterWasm],
});

if (!parserResult.success) {
	console.error("Worker build failed");
	for (const message of parserResult.logs) console.error(message);
	process.exit(1);
}

const result = await Bun.build({
	entrypoints: ["./src/index.tsx"],
	plugins: [solidPlugin],
	target: "bun",
	outdir: "dist",
	format: "esm",
	minify: true,
	sourcemap: false,
	define: {
		OTUI_TREE_SITTER_WORKER_PATH: parserWorker,
		VERSION: VERSION ?? "dev-build",
	},
});

if (!result.success) {
	for (const log of result.logs) console.error(log);
	process.exit(1);
}

console.log(`built successfully`);
