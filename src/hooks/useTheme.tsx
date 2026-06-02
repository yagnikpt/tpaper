import type { ThemeMode } from "@opentui/core";
import { useRenderer } from "@opentui/solid";
import {
	createContext,
	createEffect,
	createMemo,
	createSignal,
	type JSX,
	useContext,
} from "solid-js";
import { getTheme, type Theme } from "@/theme";

type ThemeContextType = [
	theme: () => Theme,
	mode: () => ThemeMode | null,
	setMode: (mode: ThemeMode | null) => void,
];

const ThemeContext = createContext<ThemeContextType>();

export function ThemeProvider(props: { children: JSX.Element }) {
	const renderer = useRenderer();
	const [mode, setMode] = createSignal<ThemeMode | null>(renderer.themeMode);
	const theme = createMemo(() => getTheme(mode()));

	createEffect(() => {
		const handleThemeChange = (nextMode: ThemeMode) => {
			setMode(nextMode);
		};

		renderer.on("theme_mode", handleThemeChange);

		return () => renderer.off("theme_mode", handleThemeChange);
	});

	return (
		<ThemeContext.Provider value={[theme, mode, setMode]}>
			{props.children}
		</ThemeContext.Provider>
	);
}

export default function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("useTheme must be used within a ThemeProvider");
	return context;
}
