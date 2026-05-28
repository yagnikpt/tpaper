interface Theme {
	fg: string;
	bg: string;
	surface: string;
	surfaceVariant: string;
	accent: string;
	border: string;
	error: string;
}

const DARK_PALETTE: Theme = {
	fg: "#d4be98",
	bg: "#1d2021",
	surface: "#282828",
	surfaceVariant: "#3c3836",
	accent: "#EED0A6",
	border: "#928374",
	error: "#e96962",
};

const LIGHT_PALETTE: Theme = {
	fg: "#4e3829",
	bg: "#f9f5d7",
	surface: "#f2e5bc",
	surfaceVariant: "#ebdbb2",
	accent: "#644735",
	border: "#928374",
	error: "#c04a4a",
};

function getTheme(mode: "dark" | "light" | null) {
	if (mode === "light") return LIGHT_PALETTE;
	return DARK_PALETTE;
}

export { getTheme, type Theme };
