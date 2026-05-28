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
	config: {
		lastActiveBuffer: "main",
	},
};

const [store, setStore] = createStore<Store>(BASE_STORE);

function initializeStore() {
	const { buffers, activeBuffer, config } = loadInitialStore();
	setStore(
		reconcile({
			...BASE_STORE,
			activeBuffer,
			buffers,
			config,
		}),
	);
}

export { initializeStore, setStore, store };
