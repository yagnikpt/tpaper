import type { TextareaRenderable } from "@opentui/core";
import { useBindings } from "@opentui/keymap/solid";
import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import useTheme from "@/hooks/useTheme";
import { writeBlock } from "@/store/actions";
import { setStore, store } from "@/store/client";
import type { Buffer } from "@/types";

const EditBlock = () => {
	const cBlock = createMemo(() =>
		store.buffers[store.activeBuffer]!.find((b) => b.id === store.activeBlock),
	);

	const [currentBlock, setCurrentBlock] = createSignal(cBlock());
	if (!currentBlock()) return null;
	const [input, setInput] = createSignal(currentBlock()!.content ?? "");
	let textAreaRef: TextareaRenderable | undefined;

	const { theme } = useTheme();

	useBindings(() => ({
		enabled: store.screen === "edit" && store.modal.type === null,
		commands: [
			{
				name: "save-and-return",
				run() {
					setStore("screen", "blocks");
					setStore("activeBlock", null);
				},
			},
			{
				name: "edit-title",
				run() {
					write();
					setStore("modal", {
						type: "edit-block-title",
						payload: { block: currentBlock() },
					});
				},
			},
		],
		bindings: [
			{ key: "escape", cmd: "save-and-return" },
			{ key: "ctrl+s", cmd: "save-and-return" },
			{ key: "ctrl+t", cmd: "edit-title" },
		],
	}));

	createEffect(() => {
		setCurrentBlock(cBlock());
	});

	createEffect(() => {
		setCurrentBlock((b) => ({
			id: b!.id,
			content: input(),
			title: b!.title,
		}));
	});

	function write() {
		const currentBlocks = (store.buffers[store.activeBuffer] ?? []) as Buffer;
		const block = writeBlock(
			store.activeBuffer,
			currentBlock()!,
			currentBlocks,
		);
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
		<box
			border
			title={currentBlock()?.title}
			borderColor={theme().border}
			flexGrow={1}
		>
			<textarea
				ref={textAreaRef}
				focused={store.modal.type === null}
				placeholder="Enter the note..."
				textColor={theme().fg}
				focusedTextColor={theme().fg}
				cursorColor={theme().accent}
				initialValue={input()}
				onContentChange={() => {
					if (textAreaRef) setInput(textAreaRef.plainText);
				}}
			/>
		</box>
	);
};

export default EditBlock;
