import { RGBA, SyntaxStyle } from "@opentui/core";
import { useKeyboard } from "@opentui/solid";
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

	useKeyboard((key) => {
		if (key.ctrl) {
			switch (key.name) {
				case "b": {
					const currentBlocks = store.buffers[store.activeBuffer] ?? [];
					createNewBlock(
						store.activeBuffer,
						`New Block ${currentBlocks.length + 1}`,
					);
					break;
				}
			}
			return;
		}

		const currentBlocks = store.buffers[store.activeBuffer] ?? [];
		switch (key.name) {
			case "up":
				setFocused((prev) => clamp(prev - 1, 0, currentBlocks.length - 1));
				break;
			case "down":
				setFocused((prev) => clamp(prev + 1, 0, currentBlocks.length - 1));
				break;
			case "return":
				console.log("hehe");
				setStore("activeBlock", (currentBlocks[focused()] as Block).id);
				setStore("screen", "edit");
				break;
		}
	});

	return (
		<scrollbox>
			{store.buffers[store.activeBuffer]?.length === 0 && (
				<box>
					<text>No blocks</text>
				</box>
			)}
			<For each={store.buffers[store.activeBuffer]}>
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
