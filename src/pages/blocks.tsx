import { RGBA, SyntaxStyle } from "@opentui/core";
import { useKeyboard } from "@opentui/solid";
import { createSignal } from "solid-js";
import { setStore, store } from "@/store";
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
				case "b":
					setStore("blocks", (currentBlocks) => [
						...currentBlocks,
						{
							id: `${store.blocks.length + 1}`,
							title: `New title ${store.blocks.length + 1}`,
							content: "",
						},
					]);
					break;
			}
			return;
		}

		switch (key.name) {
			case "up":
				setFocused((prev) => clamp(prev - 1, 0, store.blocks.length - 1));
				break;
			case "down":
				setFocused((prev) => clamp(prev + 1, 0, store.blocks.length - 1));
				break;
			case "return":
				setStore("activeBlock", store.blocks[focused()].id);
				setStore("screen", "edit");
				break;
		}
	});

	return (
		<scrollbox>
			{store.blocks.map((item, index) => (
				<box
					border
					opacity={focused() === index ? 1 : 0.7}
					borderColor={focused() === index ? "#CCC" : "#888"}
					title={item.title}
				>
					<markdown
						paddingBottom={item.content === "" ? 1 : 0}
						syntaxStyle={syntaxStyle}
						content={item.content}
					/>
				</box>
			))}
		</scrollbox>
	);
};

export default Blocks;
