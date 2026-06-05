import { fileURLToPath } from "bun";

const dir = fileURLToPath(new URL("..", import.meta.url));
process.chdir(dir);
const pkgFile = Bun.file("./package.json");

const data = await pkgFile.json();
data.version = process.env.VERSION;

await Bun.write(pkgFile, JSON.stringify(data, null, 2));
