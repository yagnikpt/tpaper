import { createSignal } from "solid-js";

const Input = ({
	initialValue,
	onSubmit,
}: {
	initialValue?: string;
	onSubmit: (val: string) => void;
}) => {
	const [value, setValue] = createSignal(initialValue ?? "");

	return (
		<box>
			<input
				focused
				onChange={(v) => setValue(v)}
				value={value()}
				onSubmit={() => onSubmit(value())}
			/>
		</box>
	);
};

export default Input;
