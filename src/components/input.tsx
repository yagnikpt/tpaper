import { createSignal } from "solid-js";
import useTheme from "@/hooks/useTheme";

const Input = ({
	initialValue,
	onSubmit,
}: {
	initialValue?: string;
	onSubmit: (val: string) => void;
}) => {
	const [value, setValue] = createSignal(initialValue ?? "");
	const { theme } = useTheme();

	return (
		<box>
			<input
				textColor={theme().fg}
				cursorColor={theme().accent}
				focusedTextColor={theme().fg}
				focused
				onChange={(v) => setValue(v)}
				value={value()}
				onSubmit={() => onSubmit(value())}
			/>
		</box>
	);
};

export default Input;
