interface Block {
	id: string;
	title: string;
	content: string;
}

interface Store {
	screen: "buffers" | "edit";
	activeBlock: string | null;
	activeBuffer: string;
	blocks: Block[];
}

export type { Block, Store };
