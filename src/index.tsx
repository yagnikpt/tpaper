import { render } from "@opentui/solid";
import Blocks from "@/pages/blocks";
import EditBlock from "@/pages/edit-block";
import { store } from "@/store";

const App = () => {
	return store.screen === "blocks" ? <Blocks /> : <EditBlock />;
};

render(App);
