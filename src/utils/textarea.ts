function getLineFromCursorRowIndex(text: string, rowIndex: number) {
	const lines = text.split("\n");
	return lines[rowIndex];
}

type ListFormatResult = {
	token: string;
	offset: number;
};

function checkForListFormatting(line: string): ListFormatResult | false {
	const trimmed = line.trim();
	if (!trimmed) return false;

	// 1. Check for standalone checkbox
	const pureCheckboxRegex = /^\[([ xX])\]\s+/;
	const checkboxMatch = trimmed.match(pureCheckboxRegex);

	if (checkboxMatch) {
		if (trimmed.length <= checkboxMatch[0].length) return false;

		return {
			token: "[ ] ",
			offset: getLineOffset(line, "["),
		};
	}

	// 2. Check for standard Markdown lists (bullets or numbers)
	const listRegex = /^([+\-*]|\d+\.)\s+/;
	const listMatch = trimmed.match(listRegex);

	if (listMatch) {
		if (trimmed.length <= listMatch[0].length) return false;

		const rawToken = listMatch[1] as string;
		let nextToken = rawToken;

		// Increment ordered list numbers (e.g., "1." becomes "2.")
		if (/^\d+\.$/.test(rawToken)) {
			const currentNumber = parseInt(rawToken, 10);
			nextToken = `${currentNumber + 1}.`;
		}

		return {
			token: `${nextToken} `,
			offset: getLineOffset(line, rawToken.charAt(0)),
		};
	}

	return false;
}

function getLineOffset(line: string, firstChar: string): number {
	const leadingSpaces = line.indexOf(firstChar);
	return leadingSpaces > 0 ? Math.floor(leadingSpaces / 2) : 0;
}

function indentListLine(line: string): string | false {
	const trimmed = line.trim();
	if (!trimmed) return false;

	// 1. Regex to match either a pure checkbox OR a markdown list item
	const validListRegex = /^(\[([ xX])\]|([+\-*]|\d+\.))\s+/;

	if (!validListRegex.test(trimmed)) {
		return false;
	}

	return `  ${line}\n`;
}

function unindentListLine(line: string): string | false {
	const trimmed = line.trim();
	if (!trimmed) return false;

	const validListRegex = /^(\[([ xX])\]|([+\-*]|\d+\.))\s+/;
	if (!validListRegex.test(trimmed)) {
		return false;
	}

	if (line.startsWith("  ")) {
		return line.substring(2);
	}

	return false;
}

export {
	checkForListFormatting,
	getLineFromCursorRowIndex,
	indentListLine,
	unindentListLine,
};
