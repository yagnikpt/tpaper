import { useKeyboard } from "@opentui/solid";
import { type JSX, Show } from "solid-js";
import useTheme from "@/hooks/useTheme";
import { setStore, store } from "@/store/client";

interface ModalProps {
	title: string;
	children: JSX.Element;
	footer?: string;
	width?: number | "auto" | `${number}%`;
	height?: number | "auto" | `${number}%`;
}

const Modal = ({
	title,
	children,
	footer,
	width = "60%",
	height = 8,
}: ModalProps) => {
	useKeyboard((key) => {
		if (key.name === "escape") {
			setStore("modal", {
				type: null,
				payload: undefined,
				errorMsg: undefined,
			});
		}
	});
	const { theme, mode } = useTheme();

	return (
		<box
			position="absolute"
			justifyContent="center"
			alignItems="center"
			top={0}
			left={0}
			width="100%"
			height="100%"
			zIndex={20}
		>
			<box
				position="absolute"
				top={0}
				left={0}
				width={"100%"}
				height={"100%"}
				flexGrow={1}
				backgroundColor={theme().bg}
				opacity={mode() === "light" ? 0.8 : 0.2}
			/>
			<box
				width={width}
				height={height}
				titleAlignment="center"
				title={title}
				bottomTitleAlignment="right"
				bottomTitle={footer}
				backgroundColor={theme().surface}
				border
				borderColor={theme().border}
				marginBottom={3}
				justifyContent="space-between"
			>
				{children}
				<Show when={store.modal.errorMsg}>
					<text alignSelf="flex-end" fg={theme().error}>
						{store.modal.errorMsg}
					</text>
				</Show>
			</box>
		</box>
	);
};

export default Modal;
