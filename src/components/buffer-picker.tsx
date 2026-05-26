import { createSignal } from "solid-js";
import { setStore, store } from "@/store/client";

const BufferPicker = () => {
	const options = Object.keys(store.buffers).map((b) => ({
		name: b,
		value: b,
		description: "",
	}));
	const foundIndex = options.findIndex((b) => b.value === store.activeBuffer);
	const index = foundIndex !== -1 ? foundIndex : 0;
	const [highlighted, setHighlighted] = createSignal(index);

	function onSelect(value: string) {
		setStore("screen", "blocks");
		// might need queueMicrotask
		setStore("activeBuffer", value);
		setStore("modal", { type: null, payload: undefined });
		setHighlighted(0);
	}

	return (
		<box>
			<select
				focused
				width={"100%"}
				height={6}
				flexGrow={1}
				showDescription={false}
				options={options}
				selectedIndex={highlighted()}
				onChange={(index, _) => setHighlighted(index)}
				onSelect={(_, option) => {
					if (option?.value) {
						onSelect(option.value);
					}
				}}
			/>
			{/*<text alignSelf="flex-end" attributes={TextAttributes.DIM}>
				^n: create new buffer
			</text>*/}
		</box>
	);
};

export default BufferPicker;
