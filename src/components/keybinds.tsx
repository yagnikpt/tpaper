import { For } from "solid-js";
import useTheme from "@/hooks/useTheme";

const KEYBINDS = [
	{ value: "ctrl+b", help: "add a new block" },
	{ value: "ctrl+d", help: "delete the current block" },
	{ value: "ctrl+t", help: "rename the current block" },
	{ value: "ctrl+y", help: "copy the current block" },
	{ value: "ctrl+p", help: "open buffer picker" },
	{ value: "ctrl+e", help: "go to end" },
	{ value: "ctrl+a", help: "go to start" },
	{ value: "ctrl+s", help: "save the edit" },
];

const Keybinds = () => {
	const { theme } = useTheme();
	return (
		<box>
			<For each={KEYBINDS}>
				{(item) => <text fg={theme().fg}>{`${item.value}: ${item.help}`}</text>}
			</For>
		</box>
	);
};

export default Keybinds;
