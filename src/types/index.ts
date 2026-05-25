interface Block {
	id: string;
	title: string;
	content: string;
}

type Buffer = Block[];

interface Store {
	screen: "blocks" | "edit";
	activeBlock: string | null;
	activeBuffer: string;
	buffers: Record<string, Buffer>;
}

export type { Block, Buffer, Store };
