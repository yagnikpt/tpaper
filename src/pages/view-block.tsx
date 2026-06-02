import { useBindings } from "@opentui/keymap/solid";
import { createEffect, createMemo, createSignal } from "solid-js";
import useTheme from "@/hooks/useTheme";
import { setStore, store } from "@/store/client";
import { darkSyntaxStyle, lightSyntaxStyle } from "@/utils/markdown-styles";

const ViewBlock = () => {
	const cBlock = createMemo(() =>
		store.buffers[store.activeBuffer]!.find((b) => b.id === store.activeBlock),
	);

	const [currentBlock, setCurrentBlock] = createSignal(cBlock());
	if (!currentBlock()) return null;

	const [theme, mode] = useTheme();

	useBindings(() => ({
		enabled: store.screen === "view" && store.modal.type === null,
		commands: [
			{
				name: "return",
				run() {
					setStore("screen", "blocks");
					setStore("activeBlock", null);
				},
			},
			{
				name: "edit",
				run() {
					setStore("screen", "edit");
				},
			},
		],
		bindings: [
			{ key: "escape", cmd: "return" },
			{ key: "i", cmd: "edit" },
		],
	}));

	createEffect(() => {
		setCurrentBlock(cBlock());
	});

	return (
		<scrollbox
			border
			title={currentBlock()?.title}
			borderColor={theme().border}
			flexGrow={1}
		>
			<markdown
				paddingBottom={currentBlock()!.content.trim() === "" ? 1 : 0}
				syntaxStyle={mode() === "light" ? lightSyntaxStyle : darkSyntaxStyle}
				content={currentBlock()!.content}
			/>
		</scrollbox>
	);
};

export default ViewBlock;
