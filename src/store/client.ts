import { createStore } from "solid-js/store";
import { loadInitialStore } from "@/store/actions";
import type { Store } from "@/types";

const { buffers, activeBuffer } = loadInitialStore();

const [store, setStore] = createStore<Store>({
	screen: "blocks",
	activeBlock: null,
	activeBuffer,
	buffers,
	modal: {
		type: null,
	},
});

export { setStore, store };
