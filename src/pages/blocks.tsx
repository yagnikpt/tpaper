import { type ScrollBoxRenderable, TextAttributes } from "@opentui/core";
import { useBindings } from "@opentui/keymap/solid";
import { useRenderer } from "@opentui/solid";
import { type Accessor, createEffect, For, type Setter } from "solid-js";
import useTheme from "@/hooks/useTheme";
import { createNewBlock, deleteBlock } from "@/store/actions";
import { setStore, store } from "@/store/client";
import type { Block } from "@/types";
import { clamp } from "@/utils";
import { darkSyntaxStyle, lightSyntaxStyle } from "@/utils/markdown-styles";

interface Props {
	focused: Accessor<number>;
	setFocused: Setter<number>;
}

const Blocks = (props: Props) => {
	const currentBlocks = () => store.buffers[store.activeBuffer] ?? [];
	let scrollBoxRef: ScrollBoxRenderable | undefined;

	const { theme, mode } = useTheme();
	const renderer = useRenderer();

	createEffect(() => {
		if (scrollBoxRef) {
			const currentFocusedBlock = currentBlocks()[props.focused()];
			setTimeout(
				() =>
					scrollBoxRef.scrollChildIntoView(`block-${currentFocusedBlock?.id}`),
				0,
			);
		}
	});

	useBindings(() => ({
		enabled: store.screen === "blocks" && store.modal.type === null,
		commands: [
			{
				name: "create-block",
				run() {
					const blocks = currentBlocks();
					const nextTitle = getNextBlockTitle(blocks);
					const newBlocks = createNewBlock(
						store.activeBuffer,
						nextTitle,
						blocks,
						props.focused() === 0 ? 0 : props.focused() + 1,
					);
					setStore("buffers", store.activeBuffer, newBlocks);
					props.setFocused((p) => (p === 0 ? 0 : p + 1));
				},
			},
			{
				name: "edit-title",
				run() {
					const selected = currentBlocks()[props.focused()];
					if (!selected) return;
					setStore("modal", {
						type: "edit-block-title",
						payload: { block: selected },
					});
				},
			},
			{
				name: "copy-block",
				run() {
					const selected = currentBlocks()[props.focused()];
					if (!selected) return;
					renderer.copyToClipboardOSC52(selected.content);
				},
			},
			{
				name: "focus-up",
				run() {
					props.setFocused((prev) =>
						clamp(prev - 1, 0, currentBlocks().length - 1),
					);
				},
			},
			{
				name: "focus-down",
				run() {
					props.setFocused((prev) =>
						clamp(prev + 1, 0, currentBlocks().length - 1),
					);
				},
			},
			{
				name: "view-block",
				run() {
					const selected = currentBlocks()[props.focused()];
					if (!selected) return;
					const selectedId = (selected as Block).id;
					setStore("activeBlock", selectedId);
					setStore("screen", "view");
				},
			},
			{
				name: "edit-block",
				run() {
					const selected = currentBlocks()[props.focused()];
					if (!selected) return;
					const selectedId = (selected as Block).id;
					queueMicrotask(() => {
						setStore("activeBlock", selectedId);
						setStore("screen", "edit");
					});
				},
			},
			{
				name: "delete-block",
				run() {
					const selected = currentBlocks()[props.focused()];
					if (!selected) return;
					const blocks = currentBlocks().filter(
						(block) => block.id !== selected.id,
					);
					deleteBlock(store.activeBuffer, selected, currentBlocks());
					setStore("buffers", store.activeBuffer, () => blocks);
					if (props.focused() > 0) props.setFocused((p) => p - 1);
				},
			},
			{
				name: "goto-end",
				run() {
					props.setFocused(currentBlocks().length - 1);
				},
			},
			{
				name: "goto-start",
				run() {
					props.setFocused(0);
				},
			},
		],
		bindings: [
			{ key: "ctrl+b", cmd: "create-block" },
			{ key: "ctrl+d", cmd: "delete-block" },
			{ key: "ctrl+t", cmd: "edit-title" },
			{ key: "ctrl+y", cmd: "copy-block" },
			{ key: "up", cmd: "focus-up" },
			{ key: "k", cmd: "focus-up" },
			{ key: "down", cmd: "focus-down" },
			{ key: "j", cmd: "focus-down" },
			{ key: "return", cmd: "edit-block" },
			{ key: "i", cmd: "edit-block" },
			{ key: "v", cmd: "view-block" },
			{ key: "ctrl+e", cmd: "goto-end" },
			{ key: "ctrl+a", cmd: "goto-start" },
		],
	}));

	return (
		<scrollbox
			viewportCulling
			scrollbarOptions={{ width: 0 }}
			ref={scrollBoxRef}
		>
			{currentBlocks().length === 0 && (
				<box flexGrow={1} justifyContent="center" alignItems="center">
					<text fg={theme().fg} attributes={TextAttributes.DIM}>
						No blocks! Create one with ctrl+b
					</text>
				</box>
			)}
			<For each={currentBlocks()}>
				{(item, index) => (
					<box
						id={`block-${item.id}`}
						border
						backgroundColor={
							props.focused() === index() && store.modal.type === null
								? theme().surfaceVariant
								: "transparent"
						}
						borderColor={props.focused() === index() ? theme().border : "#888"}
						marginBottom={index() === currentBlocks().length - 1 ? 1 : 0}
						title={item.title}
					>
						<markdown
							paddingBottom={item.content.trim() === "" ? 1 : 0}
							syntaxStyle={
								mode() === "light" ? lightSyntaxStyle : darkSyntaxStyle
							}
							content={item.content}
						/>
					</box>
				)}
			</For>
		</scrollbox>
	);
};

export default Blocks;

function getNextBlockTitle(blocks: Block[]) {
	const usedTitles = new Set(blocks.map((block) => block.title));
	const maxAutoTitleNumber = blocks.reduce((max, block) => {
		const match = block.title.match(/^New Block (\d+)$/);
		if (!match) return max;
		return Math.max(max, Number(match[1]));
	}, 0);

	let nextNumber = maxAutoTitleNumber + 1;
	let candidate = `New Block ${nextNumber}`;
	while (usedTitles.has(candidate)) {
		nextNumber += 1;
		candidate = `New Block ${nextNumber}`;
	}

	return candidate;
}
