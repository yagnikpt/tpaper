import { Match, Switch } from "solid-js";
import BufferPicker from "@/components/buffer-picker";
import Input from "@/components/input";
import Modal from "@/components/modal";
import { createNewBuffer, renameBlockTitle } from "@/store/actions";
import { setStore, store } from "@/store/client";
import { sortBlocksDesc } from "@/utils";

const ModalRoot = () => {
	function renameAction(value: string) {
		const currentBlock = store.buffers[store.activeBuffer]?.filter(
			(b) => b.id === store.modal.payload?.block.id,
		)[0];
		if (!currentBlock) return;

		const newBlock = renameBlockTitle(
			store.activeBuffer,
			store.buffers[store.activeBuffer]!,
			currentBlock!,
			value,
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

	function newBuffer(newVal: string) {
		const newBuffer = createNewBuffer(newVal, store.buffers);
		if (newBuffer) {
			setStore("buffers", (currentBuffers) => {
				return {
					...currentBuffers,
					[newBuffer]: [],
				};
			});
			setStore("activeBuffer", newBuffer);
		}
		setStore("modal", { type: null, payload: undefined });
	}

	return (
		<Switch>
			<Match when={store.modal.type === "edit-block-title"}>
				<Modal height={5} title="Edit Title">
					<Input
						initialValue={store.modal.payload?.block.title}
						onSubmit={renameAction}
					/>
				</Modal>
			</Match>
			<Match when={store.modal.type === "buffer-picker"}>
				<Modal
					height={8}
					title="Buffers"
					footer="^n: create, f2: rename, ^d: delete"
				>
					<BufferPicker />
				</Modal>
			</Match>
			<Match when={store.modal.type === "new-buffer"}>
				<Modal height={5} title="New Buffer">
					<Input onSubmit={newBuffer} />
				</Modal>
			</Match>
		</Switch>
	);
};

export default ModalRoot;
