import { render, useKeyboard, useRenderer } from "@opentui/solid";
import { Match, Switch } from "solid-js";
import Blocks from "@/pages/blocks";
import EditBlock from "@/pages/edit-block";
import { store } from "@/store";

const App = () => {
	const renderer = useRenderer();

	useKeyboard((key) => {
		if (key.ctrl && key.name === "l") {
			renderer.console.toggle();
		}
	});

	return (
		<Switch>
			<Match when={store.screen === "blocks"}>
				<Blocks />
			</Match>
			<Match when={store.screen === "edit"}>
				<EditBlock />
			</Match>
		</Switch>
	);
};

render(App);
