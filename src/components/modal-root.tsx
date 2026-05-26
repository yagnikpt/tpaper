import { Match, Switch } from "solid-js";
import Modal from "@/components/modal";
import { store } from "@/store/client";
import EditBlockTitleModal from "./modals/edit-block-title";

const ModalRoot = () => {
	return (
		<Switch>
			<Match when={store.modal.type === "edit-block-title"}>
				<Modal height={5} title="Edit Title">
					<EditBlockTitleModal payload={store.modal.payload} />
				</Modal>
			</Match>
		</Switch>
	);
};

export default ModalRoot;
