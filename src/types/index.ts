type ModalType = "new-buffer" | "edit-block-title" | "select-buffer" | null;

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
			blockId: string;
		};
	};
}

export type { Block, Buffer, Store };
