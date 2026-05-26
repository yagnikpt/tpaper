import { useKeyboard } from "@opentui/solid";
import type { JSX } from "solid-js";
import { setStore } from "@/store/client";

interface ModalProps {
	title: string;
	children: JSX.Element;
	width?: number | "auto" | `${number}%`;
	height?: number | "auto" | `${number}%`;
}

const Modal = ({ title, children, width = "60%", height = 8 }: ModalProps) => {
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
				backgroundColor={"#000"}
				opacity={0.2}
			/>
			<box
				width={width}
				height={height}
				titleAlignment="center"
				title={title}
				backgroundColor="#222"
				border
			>
				{children}
			</box>
		</box>
	);
};

export default Modal;
