type ModalType =
	| "new-buffer"
	| "rename-buffer"
	| "edit-block-title"
	| "buffer-picker"
	| "keybinds"
	| null;

interface Block {
	id: string;
	title: string;
	content: string;
}

type Buffer = Block[];

interface Config {
	lastActiveBuffer: string;
}

interface Store {
	screen: "blocks" | "edit";
	activeBlock: string | null;
	activeBuffer: string;
	buffers: Record<string, Buffer>;
	modal: {
		type: ModalType;
		payload?: {
			block?: Block;
			bufferName?: string;
		};
		errorMsg?: string;
	};
	config: Config;
}

export type { Block, Buffer, Config, Store };
