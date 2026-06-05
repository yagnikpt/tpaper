import { unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { file, spawnSync, write } from "bun";
import { createUniqueId } from "solid-js";

const systemEditorEdit = async (initialContent: string) => {
	const tempFilePath = join(tmpdir(), `opentui-note-${createUniqueId()}.md`);

	try {
		await write(tempFilePath, initialContent);

		const systemEditor = process.env.EDITOR || "nano";
		const args = [tempFilePath];

		if (systemEditor.includes("code")) {
			args.unshift("--wait");
		}

		spawnSync({
			cmd: [systemEditor, ...args],
			stdout: "inherit",
			stdin: "inherit",
			stderr: "inherit",
			env: { ...process.env },
		});

		const updatedFile = file(tempFilePath);
		const updatedText = await updatedFile.text();
		return updatedText;
	} catch (error) {
		console.error("Failed executing editor pipeline:", error);
	} finally {
		try {
			unlinkSync(tempFilePath);
		} catch {}
	}
};

export { systemEditorEdit };
