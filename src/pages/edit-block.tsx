import type { TextareaRenderable } from "@opentui/core";
import { useBindings } from "@opentui/keymap/solid";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { setStore, store } from "@/store";
import { writeBlock } from "@/store/actions";
import type { Buffer } from "@/types";

const EditBlock = () => {
	const cBlock = ((store.buffers[store.activeBuffer] ?? []) as Buffer).find(
		(b) => b.id === store.activeBlock,
	);

	const [currentBlock, setCurrentBlock] = createSignal(cBlock);
	if (!currentBlock()) return null;
	const [input, setInput] = createSignal(currentBlock()!.content ?? "");
	let textAreaRef: TextareaRenderable | undefined;

	useBindings(() => ({
		enabled: store.screen === "edit",
		commands: [
			{
				name: "back-to-blocks",
				run() {
					setStore("screen", "blocks");
					setStore("activeBlock", null);
				},
			},
		],
		bindings: [{ key: "escape", cmd: "back-to-blocks" }],
	}));

	createEffect(() => {
		setCurrentBlock((b) => ({
			id: b!.id,
			content: input(),
			title: b!.title,
		}));
	});

	onCleanup(() => {
		writeBlock(store.activeBuffer, currentBlock()!);
	});

	return (
		<box border title={currentBlock()?.title} borderColor="#CCC" flexGrow={1}>
			<textarea
				ref={textAreaRef}
				focused
				placeholder="Enter the note..."
				initialValue={input()}
				onContentChange={() => {
					if (textAreaRef) setInput(textAreaRef.plainText);
				}}
			/>
		</box>
	);
};

export default EditBlock;
