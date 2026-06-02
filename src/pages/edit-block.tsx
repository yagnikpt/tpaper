import type { KeyBinding, TextareaRenderable } from "@opentui/core";
import { useBindings } from "@opentui/keymap/solid";
import {
	createEffect,
	createMemo,
	createSignal,
	onCleanup,
	onMount,
} from "solid-js";
import useTheme from "@/hooks/useTheme";
import { writeBlock } from "@/store/actions";
import { setStore, store } from "@/store/client";
import type { Buffer } from "@/types";
import {
	checkForListFormatting,
	getLineFromCursorRowIndex,
} from "@/utils/textarea";

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
			{
				name: "view-block",
				run() {
					setStore("screen", "view");
				},
			},
			{
				name: "tab-it",
				run() {
					textAreaRef!.insertChar("  ");
				},
			},
			{
				name: "newline-it",
				run() {
					const lastLine = getLineFromCursorRowIndex(
						input(),
						textAreaRef!.logicalCursor.row,
					);
					if (!lastLine) {
						textAreaRef!.insertChar("\n");
						return;
					}
					const token = checkForListFormatting(lastLine);
					if (token) {
						textAreaRef!.insertChar("\n");
						textAreaRef!.insertText(
							`${"  ".repeat(token.offset)}${token.token}`,
						);
						return;
					}
					textAreaRef!.insertChar("\n");
				},
			},
		],
		bindings: [
			{ key: "escape", cmd: "save-and-return" },
			{ key: "ctrl+s", cmd: "save-and-return" },
			{ key: "ctrl+t", cmd: "edit-title" },
			{ key: "ctrl+v", cmd: "view-block" },
			{ key: "tab", cmd: "tab-it" },
			{ key: "return", cmd: "newline-it" },
		],
	}));

	//  const textAreaKeybindings: KeyBinding = {
	//    action: ""
	// }

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

	onMount(() => {
		textAreaRef!.gotoBufferEnd();
	});

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
