import type { TextareaRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/solid";
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

	useKeyboard((key) => {
		if (key.ctrl) {
			return;
		}

		switch (key.name) {
			case "escape":
				setStore("screen", "blocks");
				setStore("activeBlock", null);
				break;
		}
	});

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
		<box border borderColor="#CCC" flexGrow={1}>
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
