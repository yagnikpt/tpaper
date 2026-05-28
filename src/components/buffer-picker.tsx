import { useBindings } from "@opentui/keymap/solid";
import { createSignal } from "solid-js";
import { deleteBuffer } from "@/store/actions";
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

	useBindings(() => ({
		commands: [
			{
				name: "new-buffer",
				run() {
					setStore("modal", { type: "new-buffer" });
				},
			},
			{
				name: "rename-buffer",
				run() {
					const selected = options.map((o) => o.value)[highlighted()];
					if (!selected) return;
					setStore("modal", {
						type: "rename-buffer",
						payload: { bufferName: selected },
					});
				},
			},
			{
				name: "delete-buffer",
				run() {
					const selected = options.map((o) => o.value)[highlighted()];
					if (!selected) return;
					const deletedBuffer = deleteBuffer(selected, store.buffers);
					if (deletedBuffer) {
						setStore("buffers", (b) => {
							delete b[deletedBuffer];
							if (Object.keys(b).length === 0) {
								setStore("activeBuffer", "main");
								return { main: [] };
							} else {
								setStore("activeBuffer", Object.keys(store.buffers)[0]!);
								return b;
							}
						});
					}
					setStore("modal", {
						type: null,
						payload: undefined,
						errorMsg: undefined,
					});
				},
			},
		],
		bindings: [
			{ key: "ctrl+n", cmd: "new-buffer" },
			{ key: "f2", cmd: "rename-buffer" },
			{ key: "ctrl+d", cmd: "delete-buffer" },
		],
	}));

	function onSelect(value: string) {
		setStore("screen", "blocks");
		// might need queueMicrotask
		setStore("activeBuffer", value);
		setStore("modal", { type: null, payload: undefined, errorMsg: undefined });
		setHighlighted(0);
	}

	return (
		<box>
			<select
				selectedTextColor={"#EED0A6"}
				selectedBackgroundColor={"#3c3836"}
				backgroundColor={"#282828"}
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
		</box>
	);
};

export default BufferPicker;
