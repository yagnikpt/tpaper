import type { TextareaRenderable } from "@opentui/core";
import { useBindings } from "@opentui/keymap/solid";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { writeBlock } from "@/store/actions";
import { setStore, store } from "@/store/client";
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
		enabled: store.screen === "edit" && store.modal.type === null,
		commands: [
			{
				name: "back-to-blocks",
				run() {
					setStore("screen", "blocks");
					setStore("activeBlock", null);
				},
			},
			{
				name: "edit-title",
				run() {
					setStore("modal", {
						type: "edit-block-title",
						payload: { block: currentBlock() },
					});
				},
			},
		],
		bindings: [
			{ key: "escape", cmd: "back-to-blocks" },
			{ key: "ctrl+t", cmd: "edit-title" },
		],
	}));

	createEffect(() => {
		setCurrentBlock((b) => ({
			id: b!.id,
			content: input(),
			title: b!.title,
		}));
	});

	function write() {
		const currentBlocks = (store.buffers[store.activeBuffer] ?? []) as Buffer;
		const block = writeBlock(store.activeBuffer, currentBlock()!, currentBlocks);
		setStore("buffers", store.activeBuffer, (blocks) => {
			const prev = (blocks ?? []) as Buffer;
			const idx = prev.findIndex((b) => b.id === block.id);
			if (idx === -1) return [...prev, block];
			const next = [...prev];
			next[idx] = block;
			return next;
		});
	}

	onCleanup(write);

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
