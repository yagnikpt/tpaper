import { useKeyboard } from "@opentui/solid";
import type { JSX } from "solid-js";
import { setStore } from "@/store/client";

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
			setStore("modal", { type: null, payload: undefined });
		}
	});

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
				backgroundColor={"#1d2021"}
				opacity={0.2}
			/>
			<box
				width={width}
				height={height}
				titleAlignment="center"
				title={title}
				bottomTitleAlignment="right"
				bottomTitle={footer}
				backgroundColor="#282828"
				border
				marginBottom={3}
			>
				{children}
			</box>
		</box>
	);
};

export default Modal;
