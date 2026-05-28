import fs from "node:fs";
import path from "node:path";
import envPaths from "env-paths";
import yaml from "js-yaml";
import type { Config } from "@/types";

const DEFAULT_CONFIG: Config = {
	lastActiveBuffer: "main",
};

const { config: configDir } = envPaths("dblocks", { suffix: "cli" });
const CONFIG_FILE = path.join(configDir, "config.yaml");

function loadConfig(): Config {
	if (!fs.existsSync(CONFIG_FILE)) {
		saveConfig(DEFAULT_CONFIG);
		return { ...DEFAULT_CONFIG };
	}

	try {
		const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
		const parsed = yaml.load(raw) as Partial<Config> | null;
		return { ...DEFAULT_CONFIG, ...parsed };
	} catch {
		// Corrupt file — overwrite with defaults
		saveConfig(DEFAULT_CONFIG);
		return { ...DEFAULT_CONFIG };
	}
}

function saveConfig(config: Config): void {
	try {
		if (!fs.existsSync(configDir)) {
			fs.mkdirSync(configDir, { recursive: true });
		}
		const content = yaml.dump(config, { lineWidth: -1 });
		fs.writeFileSync(CONFIG_FILE, content, "utf-8");
	} catch (e) {
		throw new Error(`Failed to write config file: ${e}`);
	}
}

export { CONFIG_FILE, DEFAULT_CONFIG, loadConfig, saveConfig };
