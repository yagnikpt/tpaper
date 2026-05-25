import { createStore } from "solid-js/store";
import type { Store } from "@/types";

const [store, setStore] = createStore<Store>({
	screen: "buffers",
	activeBlock: null,
	activeBuffer: "main",
	blocks: [
		{
			id: "1",
			title: "title1",
			content: `# main header
## another header
- task1
- task1
       `,
		},
		{
			id: "2",
			title: "title2",
			content: `# main header
## another header
- task1
- task1
        `,
		},
		{
			id: "3",
			title: "title3",
			content: `# main header
## another header
- task1
- task1
        `,
		},
	],
});

export { setStore, store };
