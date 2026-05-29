import "@opentui/solid/preload";
import { TextAttributes } from "@opentui/core";
import { createDefaultOpenTuiKeymap } from "@opentui/keymap/opentui";
import { KeymapProvider, useBindings } from "@opentui/keymap/solid";
import { render, useRenderer } from "@opentui/solid";
import { createEffect, createSignal, Match, Switch } from "solid-js";
import { handleCLIArgs } from "@/cli";
import ModalRoot from "@/components/modal-root";
import { saveConfig } from "@/config";
import useTheme from "@/hooks/useTheme";
import Blocks from "@/pages/blocks";
import EditBlock from "@/pages/edit-block";
import { initializeStore, setStore, store } from "@/store/client";

const App = () => {
	useBindings(() => ({
		commands: [
			{
				name: "open-buffer-picker",
				run() {
					setStore("modal", { type: "buffer-picker" });
				},
			},
		],
		bindings: [{ key: "ctrl+p", cmd: "open-buffer-picker" }],
	}));

	createEffect(() => {
		saveConfig(store.config);
	});

	const { theme } = useTheme();
	const [focused, setFocused] = createSignal(0);

	createEffect(() => {
		if (store.activeBuffer) setFocused(0);
	});

	return (
		<box flexGrow={1}>
			<Switch>
				<Match when={store.screen === "blocks"}>
					<Blocks focused={focused} setFocused={setFocused} />
				</Match>
				<Match when={store.screen === "edit"}>
					<EditBlock />
				</Match>
			</Switch>
			<box flexShrink={0} zIndex={10} backgroundColor={theme().surface}>
				<Switch>
					<Match when={store.screen === "blocks"}>
						<text maxHeight={1} fg={theme().fg} attributes={TextAttributes.DIM}>
							^b: add | ^d: delete | ^t: rename | ^y: copy | ^h: keybinds
						</text>
					</Match>
					<Match when={store.screen === "edit"}>
						<text maxHeight={1} fg={theme().fg} attributes={TextAttributes.DIM}>
							esc | ^s: save & return | ^t: rename title
						</text>
					</Match>
				</Switch>
			</box>
			<ModalRoot />
		</box>
	);
};

const GlobalBindings = () => {
	const renderer = useRenderer();

	useBindings(() => ({
		commands: [
			{
				name: "toggle-console",
				run() {
					renderer.console.toggle();
				},
			},
			{
				name: "open-keybinds",
				run() {
					setStore("modal", { type: "keybinds" });
				},
			},
		],
		bindings: [
			{ key: "ctrl+l", cmd: "toggle-console" },
			{ key: "ctrl+h", cmd: "open-keybinds" },
		],
	}));

	return null;
};

const Root = () => {
	const renderer = useRenderer();
	const keymap = createDefaultOpenTuiKeymap(renderer);

	return (
		<KeymapProvider keymap={keymap}>
			<GlobalBindings />
			<App />
		</KeymapProvider>
	);
};

handleCLIArgs();
initializeStore();
render(Root);
