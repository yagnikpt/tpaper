import type { ThemeMode } from "@opentui/core";
import { useRenderer } from "@opentui/solid";
import { createEffect, createSignal } from "solid-js";
import { getTheme, type Theme } from "@/theme";

function useTheme() {
	const renderer = useRenderer();
	const [mode, setMode] = createSignal<ThemeMode | null>(renderer.themeMode);
	const [theme, setTheme] = createSignal<Theme>(getTheme(mode()));

	renderer.on("theme_mode", (nextMode: ThemeMode) => {
		setMode(nextMode);
	});

	createEffect(() => {
		setTheme(getTheme(mode()));
	});

	return { theme, mode };
}

export default useTheme;
