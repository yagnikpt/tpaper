import { useKeyboard } from "@opentui/solid";
import { createSignal } from "solid-js";
import { setStore, store } from "@/store";

const EditBlock = () => {
	const currentBlock = store.blocks.filter(
		(b) => b.id === store.activeBlock,
	)[0];
	const [input, setInput] = createSignal(currentBlock?.content ?? "");

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
			case "escape":
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
	});

	return (
		<box flexGrow={1}>
			<textarea
				initialValue={input()}
				onContentChange={(v) => setInput(v.toString())}
			/>
		</box>
	);
};

export default Buffer;
