import "@opentui/solid/preload";
import { TextAttributes } from "@opentui/core";
import { createDefaultOpenTuiKeymap } from "@opentui/keymap/opentui";
import { KeymapProvider, useBindings } from "@opentui/keymap/solid";
import { render, useRenderer } from "@opentui/solid";
import { createEffect, Match, Switch } from "solid-js";
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

	return (
		<box flexGrow={1}>
			<Switch>
				<Match when={store.screen === "blocks"}>
					<Blocks />
				</Match>
				<Match when={store.screen === "edit"}>
					<EditBlock />
				</Match>
			</Switch>
			<box backgroundColor={theme().surface}>
				<Switch>
					<Match when={store.screen === "blocks"}>
						<text fg={theme().fg} attributes={TextAttributes.DIM}>
							^b: add | ^d: delete | ^p: buffer picker | ^t: rename
						</text>
					</Match>
					<Match when={store.screen === "edit"}>
						<text attributes={TextAttributes.DIM}>
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
		],
		bindings: [{ key: "ctrl+l", cmd: "toggle-console" }],
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
