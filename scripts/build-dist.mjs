import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const distDir = resolve(rootDir, "dist");

const entriesToCopy = ["manifest.json", "src", "assets"];

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

for (const entry of entriesToCopy) {
  const sourcePath = resolve(rootDir, entry);
  if (!existsSync(sourcePath)) {
    throw new Error(`Missing required path: ${entry}`);
  }

  cpSync(sourcePath, resolve(distDir, entry), { recursive: true });
}

console.log("Built extension bundle in dist/");
