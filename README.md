# tpaper

A terminal-based note-taking app built around the idea of **buffers** and **blocks** — think of it as a lightweight, keyboard-driven notebook that lives entirely in your terminal.

Yes its a [heynote](https://github.com/heyman/heynote) rip-off for the terminal with less features.


![Demo GIF](assets/demo.gif)

## Concepts

- **Buffer** — a named collection of blocks, stored as a Markdown file on disk. Roughly analogous to a notebook or a tab.
- **Block** — an individual note within a buffer, written in Markdown and rendered with syntax highlighting in the terminal.

## Data storage

Everything is stored locally. The exact paths depend on your OS.

| Kind | Path (Linux example) |
|---|---|
| Buffers | `~/.local/share/tpaper-cli/` |
| Config | `~/.config/tpaper-cli/config.yaml` |

Buffers are plain Markdown files. Blocks are delimited by HTML comments so the files remain human-readable outside the app.

## Development

```bash
bun install
bun dev        # run with file watching
```

## Building

```bash
bun run build          # produces dist/tpaper (linux-x64 by default)
```

You can override the target and output path via environment variables:

```bash
BUN_TARGET=bun-darwin-arm64 OUTFILE=./dist/tpaper-mac bun run build
```

## Stack

- [OpenTUI](https://opentui.com) — terminal UI framework
- [Solid.js](https://solidjs.com) — reactive UI layer
- [Bun](https://bun.sh) — runtime and bundler
- [js-yaml](https://github.com/nodeca/js-yaml) — config serialization
