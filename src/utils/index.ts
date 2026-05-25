const clamp = (value: number, min: number, max: number) => {
	return Math.min(Math.max(value, min), max);
};

const sortedDesc = (arr: any[]) =>
	[...arr].sort((a, b) => b.id.localeCompare(a.id));

export { clamp };
