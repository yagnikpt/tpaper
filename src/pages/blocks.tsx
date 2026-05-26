import { RGBA, SyntaxStyle } from "@opentui/core";
import { useBindings } from "@opentui/keymap/solid";
import { createSignal, For } from "solid-js";
import { setStore, store } from "@/store";
import { createNewBlock } from "@/store/actions";
import type { Block } from "@/types";
import { clamp } from "@/utils";

const syntaxStyle = SyntaxStyle.fromStyles({
	"markup.heading.1": { fg: RGBA.fromHex("#58A6FF"), bold: true },
	"markup.list": { fg: RGBA.fromHex("#FF7B72") },
	"markup.raw": { fg: RGBA.fromHex("#A5D6FF") },
	default: { fg: RGBA.fromHex("#E6EDF3") },
});

const Blocks = () => {
	const [focused, setFocused] = createSignal(0);
	const currentBlocks = () => store.buffers[store.activeBuffer] ?? [];

	useBindings(() => ({
		enabled: store.screen === "blocks",
		commands: [
			{
				name: "create-block",
				run() {
					createNewBlock(
						store.activeBuffer,
						`New Block ${currentBlocks().length + 1}`,
					);
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
		],
		bindings: [
			{ key: "ctrl+b", cmd: "create-block" },
			{ key: "up", cmd: "focus-up" },
			{ key: "down", cmd: "focus-down" },
			{ key: "return", cmd: "open-block" },
		],
	}));

	return (
		<scrollbox>
			{currentBlocks().length === 0 && (
				<box>
					<text>No blocks</text>
				</box>
			)}
			<For each={currentBlocks()}>
				{(item, index) => (
					<box
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
