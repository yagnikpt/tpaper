import { RGBA, SyntaxStyle } from "@opentui/core";

const darkSyntaxStyle = SyntaxStyle.fromStyles({
	// Base fallback
	default: { fg: RGBA.fromHex("#E6E0D6") },

	// Conceal markers / borders
	conceal: { fg: RGBA.fromHex("#6B6B6B") },

	// Headings with hierarchy
	"markup.heading": { fg: RGBA.fromHex("#F0E6D2"), bold: true },
	"markup.heading.1": { fg: RGBA.fromHex("#F4D9B2"), bold: true },
	"markup.heading.2": { fg: RGBA.fromHex("#EED0A6"), bold: true },
	"markup.heading.3": { fg: RGBA.fromHex("#E6C7A4"), bold: true },
	"markup.heading.4": { fg: RGBA.fromHex("#DEBA9E"), bold: true },
	"markup.heading.5": { fg: RGBA.fromHex("#D4AD96"), bold: true },
	"markup.heading.6": { fg: RGBA.fromHex("#CAA08E"), bold: true },

	// Inline formatting
	"markup.strong": { fg: RGBA.fromHex("#F7E7C3"), bold: true },
	"markup.bold": { fg: RGBA.fromHex("#F7E7C3"), bold: true },
	"markup.italic": { fg: RGBA.fromHex("#D8C9B2"), italic: true },
	"markup.em": { fg: RGBA.fromHex("#D8C9B2"), italic: true },
	"markup.strikethrough": { fg: RGBA.fromHex("#B9A38C"), dim: true },

	// Lists
	"markup.list": { fg: RGBA.fromHex("#C7B299") },

	// Links
	"markup.link": { fg: RGBA.fromHex("#8AB4F8"), underline: true },
	"markup.link.label": { fg: RGBA.fromHex("#8AB4F8"), underline: true },
	"markup.link.url": { fg: RGBA.fromHex("#5C9CFF"), underline: true },

	// Blockquotes
	"markup.quote": { fg: RGBA.fromHex("#B7C0B2"), italic: true },

	// Code / raw
	"markup.raw": { fg: RGBA.fromHex("#BFD9EA") },
	"markup.code": { fg: RGBA.fromHex("#BFD9EA") },
	"markup.raw.block": { fg: RGBA.fromHex("#BFD9EA") },

	// Tables
	"markup.table": { fg: RGBA.fromHex("#D2C2A9") },
});

const lightSyntaxStyle = SyntaxStyle.fromStyles({
	default: { fg: RGBA.fromHex("#2D2A26") },
	conceal: { fg: RGBA.fromHex("#9E9E9E") },

	"markup.heading": { fg: RGBA.fromHex("#1A1612"), bold: true },
	"markup.heading.1": { fg: RGBA.fromHex("#8B4513"), bold: true },
	"markup.heading.2": { fg: RGBA.fromHex("#A0522D"), bold: true },
	"markup.heading.3": { fg: RGBA.fromHex("#B8860B"), bold: true },
	"markup.heading.4": { fg: RGBA.fromHex("#CD853F"), bold: true },
	"markup.heading.5": { fg: RGBA.fromHex("#D2A679"), bold: true },
	"markup.heading.6": { fg: RGBA.fromHex("#C4A882"), bold: true },

	"markup.strong": { fg: RGBA.fromHex("#1A1612"), bold: true },
	"markup.bold": { fg: RGBA.fromHex("#1A1612"), bold: true },
	"markup.italic": { fg: RGBA.fromHex("#4A453D"), italic: true },
	"markup.em": { fg: RGBA.fromHex("#4A453D"), italic: true },
	"markup.strikethrough": { fg: RGBA.fromHex("#8B7D6B"), dim: true },

	"markup.list": { fg: RGBA.fromHex("#6B5B4F") },

	"markup.link": { fg: RGBA.fromHex("#1A56DB"), underline: true },
	"markup.link.label": { fg: RGBA.fromHex("#1A56DB"), underline: true },
	"markup.link.url": { fg: RGBA.fromHex("#1E40AF"), underline: true },

	"markup.quote": { fg: RGBA.fromHex("#5C6658"), italic: true },

	"markup.raw": { fg: RGBA.fromHex("#2C5282") },
	"markup.code": { fg: RGBA.fromHex("#2C5282") },
	"markup.raw.block": { fg: RGBA.fromHex("#2C5282") },

	"markup.table": { fg: RGBA.fromHex("#4A453D") },
});

export { darkSyntaxStyle, lightSyntaxStyle };
