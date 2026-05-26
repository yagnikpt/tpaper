import { RGBA, type ScrollBoxRenderable, SyntaxStyle } from "@opentui/core";
import { useBindings } from "@opentui/keymap/solid";
import { createEffect, createSignal, For } from "solid-js";
import { createNewBlock, deleteBlock } from "@/store/actions";
import { setStore, store } from "@/store/client";
import type { Block } from "@/types";
import { clamp, sortBlocksDesc } from "@/utils";

const syntaxStyle = SyntaxStyle.fromStyles({
	"markup.heading.1": { fg: RGBA.fromHex("#58A6FF"), bold: true },
	"markup.list": { fg: RGBA.fromHex("#FF7B72") },
	"markup.raw": { fg: RGBA.fromHex("#A5D6FF") },
	default: { fg: RGBA.fromHex("#E6EDF3") },
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
					const block = createNewBlock(
						store.activeBuffer,
						`New Block ${currentBlocks().length + 1}`,
					);
					setStore("buffers", store.activeBuffer, () => [
						...currentBlocks(),
						block,
					]);
				},
			},
			{
				name: "edit-title",
				run() {
					const selected = currentBlocks()[focused()];
					if (!selected) return;
					setStore("modal", {
						type: "edit-block-title",
						payload: { blockId: selected.id },
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
				name: "open-block",
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
					deleteBlock(store.activeBuffer, selected);
					const blocks = sortBlocksDesc(
						currentBlocks().filter((block) => block.id !== selected.id),
					);
					setStore("buffers", store.activeBuffer, () => blocks);
				},
			},
		],
		bindings: [
			{ key: "ctrl+b", cmd: "create-block" },
			{ key: "ctrl+d", cmd: "delete-block" },
			{ key: "ctrl+t", cmd: "edit-title" },
			{ key: "up", cmd: "focus-up" },
			{ key: "down", cmd: "focus-down" },
			{ key: "return", cmd: "open-block" },
		],
	}));

	return (
		<scrollbox
			viewportCulling
			scrollbarOptions={{ width: 0 }}
			ref={scrollBoxRef}
		>
			{currentBlocks().length === 0 && (
				<box>
					<text>No blocks</text>
				</box>
			)}
			<For each={currentBlocks()}>
				{(item, index) => (
					<box
						id={`block-${item.id}`}
						border
						opacity={focused() === index() ? 1 : 0.7}
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
