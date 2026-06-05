import path from "node:path";
import solidPlugin from "@opentui/solid/bun-plugin";

const parserWorker = path.resolve(
	"node_modules/@opentui/core/parser.worker.js",
);
const workerRelativePath = path
	.relative(process.cwd(), parserWorker)
	.replaceAll("\\", "/");

const BUILD_TARGETS: { target: Bun.Build.CompileTarget; outfile: string }[] = [
	{
		target: "bun-linux-x64-modern",
		outfile: "./build_artifacts/tpaper-linux-amd64",
	},
	{
		target: "bun-linux-arm64-modern",
		outfile: "./build_artifacts/tpaper-linux-arm64",
	},
	{
		target: "bun-darwin-arm64-modern",
		outfile: "./build_artifacts/tpaper-darwin-arm64",
	},
	{
		target: "bun-darwin-x64-modern",
		outfile: "./build_artifacts/tpaper-darwin-amd64",
	},
	{
		target: "bun-windows-x64-modern",
		outfile: "./build_artifacts/tpaper-windows-amd64",
	},
];

const VERSION = process.env.VERSION;

for (const { target, outfile } of BUILD_TARGETS) {
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
			VERSION: VERSION ?? "dev-build",
		},
	});

	if (!result.success) {
		for (const log of result.logs) console.error(log);
		process.exit(1);
	}

	console.log(`built ${outfile} (${target})`);
}
