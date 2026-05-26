import { createSignal } from "solid-js";
import { renameBlockTitle } from "@/store/actions";
import { setStore, store } from "@/store/client";
import { sortBlocksDesc } from "@/utils";

const EditBlockTitleModal = ({
	payload,
}: {
	payload?: { blockId: string };
}) => {
	const currentBlock = store.buffers[store.activeBuffer]?.filter(
		(b) => b.id === payload?.blockId,
	)[0];
	if (!currentBlock) return null;

	const [value, setValue] = createSignal(currentBlock.title);

	function renameAction() {
		const newBlock = renameBlockTitle(
			store.activeBuffer,
			store.buffers[store.activeBuffer]!,
			currentBlock!,
			value(),
		);
		if (newBlock) {
			const sorted = sortBlocksDesc([
				...store.buffers[store.activeBuffer]!.filter(
					(block) => block.id !== currentBlock!.id,
				),
				newBlock,
			]);
			setStore("buffers", store.activeBuffer, () => sorted);
		}

		setStore("modal", { type: null, payload: undefined });
	}

	return (
		<box>
			<input
				focused
				onChange={(v) => setValue(v)}
				value={value()}
				onSubmit={renameAction}
			/>
		</box>
	);
};

export default EditBlockTitleModal;
