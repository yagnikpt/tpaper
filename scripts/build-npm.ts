import solidPlugin from "@opentui/solid/bun-plugin";

const VERSION = process.env.VERSION;

const result = await Bun.build({
	entrypoints: ["./src/index.tsx"],
	plugins: [solidPlugin],
	target: "bun",
	outdir: "dist",
	format: "esm",
	minify: true,
	sourcemap: false,
	external: [
		"@opentui/*",
		"solid-js",
		"solid-js/*",
		"env-paths",
		"js-yaml",
		"uuidv7",
	],
	define: {
		VERSION: JSON.stringify(VERSION ?? "dev-build"),
	},
});

if (!result.success) {
	for (const log of result.logs) console.error(log);
	process.exit(1);
}

console.log("built successfully");
