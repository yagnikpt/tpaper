import { Match, Switch } from "solid-js";
import BufferPicker from "@/components/buffer-picker";
import Input from "@/components/input";
import Keybinds from "@/components/keybinds";
import Modal from "@/components/modal";
import {
	createNewBuffer,
	renameBlockTitle,
	renameBuffer,
} from "@/store/actions";
import { setStore, store } from "@/store/client";

const ModalRoot = () => {
	function renameAction(value: string) {
		const currentBlock = store.buffers[store.activeBuffer]?.filter(
			(b) => b.id === store.modal.payload?.block?.id,
		)[0];
		if (!currentBlock) return;

		try {
			const newBlock = renameBlockTitle(
				store.activeBuffer,
				store.buffers[store.activeBuffer]!,
				currentBlock!,
				value,
			);
			if (newBlock) {
				setStore("buffers", store.activeBuffer, (blocks) =>
					blocks.map((b) => (b.id === currentBlock.id ? newBlock : b)),
				);
			}
			setStore("modal", {
				type: null,
				payload: undefined,
				errorMsg: undefined,
			});
		} catch (e) {
			if (e instanceof Error && e.message === "DUPLICATE_TITLE")
				setStore("modal", (m) => {
					return {
						...m,
						errorMsg: `Block with title "${value}" exists!`,
					};
				});
		}
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
			setStore("config", (c) => {
				return {
					...c,
					lastActiveBuffer: newBuffer,
				};
			});
		}
		setStore("modal", { type: null, payload: undefined, errorMsg: undefined });
	}

	function renameBufferAction(newVal: string) {
		const currentName = store.modal.payload?.bufferName;
		if (!currentName) {
			setStore("modal", {
				type: null,
				payload: undefined,
				errorMsg: undefined,
			});
			return;
		}

		const nextName = renameBuffer(currentName, newVal, store.buffers);
		if (nextName) {
			setStore("buffers", (currentBuffers) => {
				currentBuffers[nextName] = { ...currentBuffers[currentName]! };
				delete currentBuffers[currentName];
				return currentBuffers;
			});
			if (store.activeBuffer === currentName) {
				setStore("activeBuffer", nextName);
				setStore("config", (c) => {
					return {
						...c,
						lastActiveBuffer: nextName,
					};
				});
			}
		}

		setStore("modal", { type: null, payload: undefined, errorMsg: undefined });
	}

	return (
		<Switch>
			<Match when={store.modal.type === "edit-block-title"}>
				<Modal height={5} title="Edit Title">
					<Input
						initialValue={store.modal.payload?.block?.title}
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
			<Match when={store.modal.type === "rename-buffer"}>
				<Modal height={5} title="Rename Buffer">
					<Input
						initialValue={store.modal.payload?.bufferName}
						onSubmit={renameBufferAction}
					/>
				</Modal>
			</Match>
			<Match when={store.modal.type === "keybinds"}>
				<Modal height={12} title="Keybinds">
					<Keybinds />
				</Modal>
			</Match>
		</Switch>
	);
};

export default ModalRoot;
