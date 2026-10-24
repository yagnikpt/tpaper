import fs from "node:fs";
import solidPlugin from "@opentui/solid/bun-plugin";

const ARTIFACTS_DIR = "./build_artifacts";
fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });

const BUILD_TARGETS: { target: Bun.Build.CompileTarget; outfile: string }[] = [
	{
		target: "bun-linux-x64-modern",
		outfile: `${ARTIFACTS_DIR}/tpaper-linux-amd64`,
	},
	{
		target: "bun-linux-arm64-modern",
		outfile: `${ARTIFACTS_DIR}/tpaper-linux-arm64`,
	},
	{
		target: "bun-darwin-arm64-modern",
		outfile: `${ARTIFACTS_DIR}/tpaper-darwin-arm64`,
	},
	{
		target: "bun-darwin-x64-modern",
		outfile: `${ARTIFACTS_DIR}/tpaper-darwin-amd64`,
	},
	{
		target: "bun-windows-x64-modern",
		outfile: `${ARTIFACTS_DIR}/tpaper-windows-amd64.exe`,
	},
	{
		target: "bun-windows-arm64",
		outfile: `${ARTIFACTS_DIR}/tpaper-windows-arm64.exe`,
	},
];

const VERSION = process.env.VERSION;

for (const { target, outfile } of BUILD_TARGETS) {
	const isMusl = target.includes("musl");
	const result = await Bun.build({
		entrypoints: ["./src/index.tsx"],
		plugins: [solidPlugin],
		compile: {
			target,
			outfile,
			autoloadBunfig: false,
		},
		define: {
			...(target.includes("linux")
				? {
						"process.env.OPENTUI_LIBC": JSON.stringify(
							isMusl ? "musl" : "glibc",
						),
					}
				: {}),
			VERSION: JSON.stringify(VERSION ?? "dev-build"),
		},
	});

	if (!result.success) {
		for (const log of result.logs) console.error(log);
		process.exit(1);
	}

	console.log(`built ${outfile} (${target})`);
}
