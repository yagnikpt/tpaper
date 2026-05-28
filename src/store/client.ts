import { createStore, reconcile } from "solid-js/store";
import { loadInitialStore } from "@/store/actions";
import type { Store } from "@/types";
import { DEFAULT_BUFFER } from "@/utils/contants";

const BASE_STORE: Store = {
	screen: "blocks",
	activeBlock: null,
	activeBuffer: DEFAULT_BUFFER,
	buffers: {
		[DEFAULT_BUFFER]: [],
	},
	modal: {
		type: null,
	},
};

const [store, setStore] = createStore<Store>(BASE_STORE);

function initializeStore() {
	const { buffers, activeBuffer } = loadInitialStore();
	setStore(
		reconcile({
			...BASE_STORE,
			activeBuffer,
			buffers,
		}),
	);
}

export { initializeStore, setStore, store };
