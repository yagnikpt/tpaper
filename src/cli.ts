import { CONFIG_FILE } from "@/config";
import { DATA_DIR } from "@/storage/fs";

declare const VERSION: string;

const HELP = `\
tpaper — a keyboard-driven notebook for your terminal.

Usage: tpaper [options]

Options:
  -v, --version         Print version
  -h, --help            Print this help message
      --local-files-path  Print the path where buffers are stored
      --config-path     Print the path to the config file
`;

export function handleCLIArgs(): void {
	const args = process.argv.slice(2);
	if (args.length === 0) return;

	for (const arg of args) {
		switch (arg) {
			case "-v":
			case "--version": {
				const version =
					typeof VERSION !== "undefined" ? VERSION : "(dev)";
				console.log(version);
				process.exit(0);
				break;
			}
			case "-h":
			case "--help": {
				console.log(HELP);
				process.exit(0);
				break;
			}
			case "--local-files-path": {
				console.log(DATA_DIR);
				process.exit(0);
				break;
			}
			case "--config-path": {
				console.log(CONFIG_FILE);
				process.exit(0);
				break;
			}
			default: {
				console.error(`Unknown option: ${arg}`);
				console.error(`Run 'tpaper --help' for usage.`);
				process.exit(1);
			}
		}
	}
}
