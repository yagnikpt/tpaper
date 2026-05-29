import {
	RGBA,
	type ScrollBoxRenderable,
	SyntaxStyle,
	TextAttributes,
} from "@opentui/core";
import { useBindings } from "@opentui/keymap/solid";
import { useRenderer } from "@opentui/solid";
import { type Accessor, createEffect, For, type Setter } from "solid-js";
import useTheme from "@/hooks/useTheme";
import { createNewBlock, deleteBlock } from "@/store/actions";
import { setStore, store } from "@/store/client";
import type { Block } from "@/types";
import { clamp } from "@/utils";

const darkSyntaxStyle = SyntaxStyle.fromStyles({
	// Base fallback
	default: { fg: RGBA.fromHex("#E6E0D6") },

	// Conceal markers / borders
	conceal: { fg: RGBA.fromHex("#6B6B6B") },

	// Headings with hierarchy
	"markup.heading": { fg: RGBA.fromHex("#F0E6D2"), bold: true },
	"markup.heading.1": { fg: RGBA.fromHex("#F4D9B2"), bold: true },
	"markup.heading.2": { fg: RGBA.fromHex("#EED0A6"), bold: true },
	"markup.heading.3": { fg: RGBA.fromHex("#E6C7A4"), bold: true },
	"markup.heading.4": { fg: RGBA.fromHex("#DEBA9E"), bold: true },
	"markup.heading.5": { fg: RGBA.fromHex("#D4AD96"), bold: true },
	"markup.heading.6": { fg: RGBA.fromHex("#CAA08E"), bold: true },

	// Inline formatting
	"markup.strong": { fg: RGBA.fromHex("#F7E7C3"), bold: true },
	"markup.bold": { fg: RGBA.fromHex("#F7E7C3"), bold: true },
	"markup.italic": { fg: RGBA.fromHex("#D8C9B2"), italic: true },
	"markup.em": { fg: RGBA.fromHex("#D8C9B2"), italic: true },
	"markup.strikethrough": { fg: RGBA.fromHex("#B9A38C"), dim: true },

	// Lists
	"markup.list": { fg: RGBA.fromHex("#C7B299") },

	// Links
	"markup.link": { fg: RGBA.fromHex("#8AB4F8"), underline: true },
	"markup.link.label": { fg: RGBA.fromHex("#8AB4F8"), underline: true },
	"markup.link.url": { fg: RGBA.fromHex("#5C9CFF"), underline: true },

	// Blockquotes
	"markup.quote": { fg: RGBA.fromHex("#B7C0B2"), italic: true },

	// Code / raw
	"markup.raw": { fg: RGBA.fromHex("#BFD9EA") },
	"markup.code": { fg: RGBA.fromHex("#BFD9EA") },
	"markup.raw.block": { fg: RGBA.fromHex("#BFD9EA") },

	// Tables
	"markup.table": { fg: RGBA.fromHex("#D2C2A9") },
});

const lightSyntaxStyle = SyntaxStyle.fromStyles({
	default: { fg: RGBA.fromHex("#2D2A26") },
	conceal: { fg: RGBA.fromHex("#9E9E9E") },

	"markup.heading": { fg: RGBA.fromHex("#1A1612"), bold: true },
	"markup.heading.1": { fg: RGBA.fromHex("#8B4513"), bold: true },
	"markup.heading.2": { fg: RGBA.fromHex("#A0522D"), bold: true },
	"markup.heading.3": { fg: RGBA.fromHex("#B8860B"), bold: true },
	"markup.heading.4": { fg: RGBA.fromHex("#CD853F"), bold: true },
	"markup.heading.5": { fg: RGBA.fromHex("#D2A679"), bold: true },
	"markup.heading.6": { fg: RGBA.fromHex("#C4A882"), bold: true },

	"markup.strong": { fg: RGBA.fromHex("#1A1612"), bold: true },
	"markup.bold": { fg: RGBA.fromHex("#1A1612"), bold: true },
	"markup.italic": { fg: RGBA.fromHex("#4A453D"), italic: true },
	"markup.em": { fg: RGBA.fromHex("#4A453D"), italic: true },
	"markup.strikethrough": { fg: RGBA.fromHex("#8B7D6B"), dim: true },

	"markup.list": { fg: RGBA.fromHex("#6B5B4F") },

	"markup.link": { fg: RGBA.fromHex("#1A56DB"), underline: true },
	"markup.link.label": { fg: RGBA.fromHex("#1A56DB"), underline: true },
	"markup.link.url": { fg: RGBA.fromHex("#1E40AF"), underline: true },

	"markup.quote": { fg: RGBA.fromHex("#5C6658"), italic: true },

	"markup.raw": { fg: RGBA.fromHex("#2C5282") },
	"markup.code": { fg: RGBA.fromHex("#2C5282") },
	"markup.raw.block": { fg: RGBA.fromHex("#2C5282") },

	"markup.table": { fg: RGBA.fromHex("#4A453D") },
});

interface Props {
	focused: Accessor<number>;
	setFocused: Setter<number>;
}

const Blocks = ({ focused, setFocused }: Props) => {
	const currentBlocks = () => store.buffers[store.activeBuffer] ?? [];
	let scrollBoxRef: ScrollBoxRenderable | undefined;

	const { theme, mode } = useTheme();
	const renderer = useRenderer();

	createEffect(() => {
		if (scrollBoxRef) {
			const currentFocusedBlock = currentBlocks()[focused()];
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
						focused() === 0 ? 0 : focused() + 1,
					);
					setStore("buffers", store.activeBuffer, newBlocks);
					setFocused((p) => (p === 0 ? 0 : p + 1));
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
				name: "copy-block",
				run() {
					const selected = currentBlocks()[focused()];
					if (!selected) return;
					renderer.copyToClipboardOSC52(selected.content);
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
					const blocks = currentBlocks().filter(
						(block) => block.id !== selected.id,
					);
					deleteBlock(store.activeBuffer, selected, currentBlocks());
					setStore("buffers", store.activeBuffer, () => blocks);
					if (focused() > 0) setFocused((p) => p - 1);
				},
			},
			{
				name: "goto-end",
				run() {
					setFocused(currentBlocks().length - 1);
				},
			},
			{
				name: "goto-start",
				run() {
					setFocused(0);
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
							focused() === index() && store.modal.type === null
								? theme().surfaceVariant
								: "transparent"
						}
						borderColor={focused() === index() ? theme().border : "#888"}
						marginBottom={index() === currentBlocks().length - 1 ? 1 : 0}
						title={item.title}
					>
						<markdown
							paddingBottom={item.content.trim() === "" ? 1 : 0}
							syntaxStyle={
								mode() === "light" ? lightSyntaxStyle : darkSyntaxStyle
							}
							content={item.content}
							renderNode={(token, context) => {
								if (token.type === "heading") {
									return context.defaultRender(); // or return a custom renderable
								}
								return undefined; // fall back to default
							}}
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
