import "@opentui/solid/preload";
import { createDefaultOpenTuiKeymap } from "@opentui/keymap/opentui";
import { KeymapProvider, useBindings } from "@opentui/keymap/solid";
import { render, useRenderer } from "@opentui/solid";
import { Match, Switch } from "solid-js";
import ModalRoot from "@/components/modal-root";
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

initializeStore();
render(Root);
