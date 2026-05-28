import path from "node:path";
import solidPlugin from "@opentui/solid/bun-plugin";

const parserWorker = path.resolve(
	"node_modules/@opentui/core/parser.worker.js",
);
const workerRelativePath = path
	.relative(process.cwd(), parserWorker)
	.replaceAll("\\", "/");

const target =
	(process.env.BUN_TARGET as Bun.Build.CompileTarget) ?? "bun-linux-x64-modern";
const outfile = process.env.OUTFILE ?? "./dist/tpaper";

const result = await Bun.build({
	entrypoints: ["./src/index.tsx", parserWorker],
	plugins: [solidPlugin],
	compile: {
		target,
		outfile,
		autoloadBunfig: false,
	},
	define: {
		OTUI_TREE_SITTER_WORKER_PATH: JSON.stringify(
			`/$bunfs/root/${workerRelativePath}`,
		),
	},
});

if (!result.success) {
	for (const log of result.logs) console.error(log);
	process.exit(1);
}

console.log(`built ${outfile} (${target})`);
