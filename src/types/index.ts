type ModalType =
	| "new-buffer"
	| "rename-buffer"
	| "edit-block-title"
	| "buffer-picker"
	| null;

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
	modal: {
		type: ModalType;
		payload?: {
			block: Block;
		};
	};
}

export type { Block, Buffer, Store };
