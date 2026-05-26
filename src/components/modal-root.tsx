import { Match, Switch } from "solid-js";
import BufferPicker from "@/components/buffer-picker";
import EditBlockTitleModal from "@/components/edit-block-title";
import Modal from "@/components/modal";
import { store } from "@/store/client";

const ModalRoot = () => {
	return (
		<Switch>
			<Match when={store.modal.type === "edit-block-title"}>
				<Modal height={5} title="Edit Title">
					<EditBlockTitleModal payload={store.modal.payload} />
				</Modal>
			</Match>
			<Match when={store.modal.type === "buffer-picker"}>
				<Modal height={8} title="Buffers" footer="^n: create new, ^d: delete">
					<BufferPicker />
				</Modal>
			</Match>
		</Switch>
	);
};

export default ModalRoot;
