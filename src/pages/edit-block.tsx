import { useKeyboard } from "@opentui/solid";
import { createEffect, createSignal } from "solid-js";
import { setStore, store } from "@/store";
import type { Buffer } from "@/types";

const EditBlock = () => {
	const currentBlock = (store.buffers[store.activeBuffer] as Buffer).filter(
		(b) => b.id === store.activeBlock,
	)[0];
	const [input, setInput] = createSignal(currentBlock?.content ?? "");

	useKeyboard((key) => {
		if (key.ctrl) {
			return;
		}

		switch (key.name) {
			case "escape":
				setStore("screen", "blocks");
				setStore("activeBlock", null);
				break;
		}
	});

	createEffect(() => {
		console.log(input());
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

export default EditBlock;
