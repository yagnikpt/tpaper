import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { Stream } from "node:stream";
import type { CliRenderer } from "@opentui/core";

type EditorStdio = "inherit" | "pipe" | "ignore" | number | Stream;

async function openEditor(input: {
	value: string;
	renderer: CliRenderer;
	cwd?: string;
	stdin?: EditorStdio;
}) {
	const editor = process.env.VISUAL || process.env.EDITOR;
	if (!editor) return;
	const file = path.join(os.tmpdir(), `${Date.now()}.md`);
	const cwd =
		input.cwd && existsSync(input.cwd) ? input.cwd : path.dirname(file);
	await writeFile(file, input.value);
	input.renderer.suspend();
	input.renderer.currentRenderBuffer.clear();
	try {
		await new Promise<void>((resolve, reject) => {
			const parts = editor.split(" ");
			const child = spawn(parts[0]!, [...parts.slice(1), file], {
				cwd,
				stdio: [input.stdin ?? "inherit", "inherit", "inherit"],
				shell: process.platform === "win32",
			});
			child.on("error", reject);
			child.on("exit", (code, signal) => {
				if (code === 0) return resolve();
				reject(
					new Error(
						`Editor exited with ${signal ? `signal ${signal}` : `code ${code}`}`,
					),
				);
			});
		});
		return (await readFile(file, "utf8")) || undefined;
	} finally {
		await rm(file, { force: true }).catch(() => {});
		input.renderer.currentRenderBuffer.clear();
		input.renderer.resume();
		input.renderer.requestRender();
	}
}

export { openEditor };
