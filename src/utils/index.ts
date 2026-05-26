import type { Block } from "@/types";

const clamp = (value: number, min: number, max: number) => {
	return Math.min(Math.max(value, min), max);
};

const sortBlocksDesc = (arr: Block[]) =>
	[...arr].sort((a, b) => a.id.localeCompare(b.id));

export { clamp, sortBlocksDesc };
