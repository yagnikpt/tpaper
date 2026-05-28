import { RGBA, type ScrollBoxRenderable, SyntaxStyle } from "@opentui/core";
import { useBindings } from "@opentui/keymap/solid";
import { createEffect, createSignal, For } from "solid-js";
import { createNewBlock, deleteBlock } from "@/store/actions";
import { setStore, store } from "@/store/client";
import type { Block } from "@/types";
import { clamp } from "@/utils";

const syntaxStyle = SyntaxStyle.fromStyles({
	default: { fg: RGBA.fromHex("#E6E0D6") },
	"markup.heading": { fg: RGBA.fromHex("#F0E6D2"), bold: true },
	"markup.heading.1": { fg: RGBA.fromHex("#F4D9B2"), bold: true },
	"markup.heading.2": { fg: RGBA.fromHex("#EED0A6"), bold: true },
	"markup.heading.3": { fg: RGBA.fromHex("#E6C7A4"), bold: true },
	"markup.strong": { fg: RGBA.fromHex("#F7E7C3"), bold: true },
	"markup.italic": { fg: RGBA.fromHex("#D8C9B2") },
	"markup.list": { fg: RGBA.fromHex("#C7B299") },
	"markup.link": { fg: RGBA.fromHex("#8AB4F8"), underline: true },
	"markup.quote": { fg: RGBA.fromHex("#B7C0B2"), italic: true },
	"markup.raw": { fg: RGBA.fromHex("#BFD9EA") },
	"markup.code": { fg: RGBA.fromHex("#BFD9EA") },
	"markup.strikethrough": { fg: RGBA.fromHex("#B9A38C"), dim: true },
	"markup.table": { fg: RGBA.fromHex("#D2C2A9") },
});

const Blocks = () => {
	const [focused, setFocused] = createSignal(0);
	const currentBlocks = () => store.buffers[store.activeBuffer] ?? [];
	let scrollBoxRef: ScrollBoxRenderable | undefined;

	createEffect(() => {
		if (scrollBoxRef) {
			const currentFocusedBlock = currentBlocks()[focused()];
			scrollBoxRef.scrollChildIntoView(`block-${currentFocusedBlock?.id}`);
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
					const block = createNewBlock(store.activeBuffer, nextTitle, blocks);
					setStore("buffers", store.activeBuffer, () => [...blocks, block]);
					setFocused(blocks.length);
				},
			},
			{
				name: "edit-title",
				run() {
					const selected = currentBlocks()[focused()];
					if (!selected) return;
					setStore("modal", {
						type: "edit-block-title",
						payload: { block: selected },
					});
				},
			},
			{
				name: "focus-up",
				run() {
					setFocused((prev) => clamp(prev - 1, 0, currentBlocks().length - 1));
				},
			},
			{
				name: "focus-down",
				run() {
					setFocused((prev) => clamp(prev + 1, 0, currentBlocks().length - 1));
				},
			},
			{
				name: "edit-block",
				run() {
					const selected = currentBlocks()[focused()];
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
					const selected = currentBlocks()[focused()];
					if (!selected) return;
					const blocks = currentBlocks().filter((block) => block.id !== selected.id);
					deleteBlock(store.activeBuffer, selected, currentBlocks());
					setStore("buffers", store.activeBuffer, () => blocks);
					if (focused() > 0) setFocused((p) => p - 1);
				},
			},
		],
		bindings: [
			{ key: "ctrl+b", cmd: "create-block" },
			{ key: "ctrl+d", cmd: "delete-block" },
			{ key: "ctrl+t", cmd: "edit-title" },
			{ key: "up", cmd: "focus-up" },
			{ key: "down", cmd: "focus-down" },
			{ key: "return", cmd: "edit-block" },
			{ key: "i", cmd: "edit-block" },
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
					<text>No blocks! Create one with ctrl+b</text>
				</box>
			)}
			<For each={currentBlocks()}>
				{(item, index) => (
					<box
						id={`block-${item.id}`}
						border
						backgroundColor={
							focused() === index() && store.modal.type === null
								? "#282828"
								: "transparent"
						}
						// opacity={focused() === index() ? 1 : 0.7}
						borderColor={focused() === index() ? "#CCC" : "#888"}
						title={item.title}
					>
						<markdown
							paddingBottom={item.content.trim() === "" ? 1 : 0}
							syntaxStyle={syntaxStyle}
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
