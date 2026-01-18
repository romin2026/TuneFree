import { createHash } from "crypto";
import { execFile } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const packageJsonPath = path.join(repoRoot, "package.json");
const releaseDir = path.join(repoRoot, "release");

const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));
const version = packageJson.version;
const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
const archiveName = `TuneFree-${version}-${dateStamp}.zip`;
const archivePath = path.join(releaseDir, archiveName);
const manifestPath = path.join(releaseDir, "latest.json");

await mkdir(releaseDir, { recursive: true });

await execFileAsync(
  "git",
  ["archive", "--format=zip", "-o", archivePath, "HEAD"],
  { cwd: repoRoot }
);

const archiveBuffer = await readFile(archivePath);
const sha256 = createHash("sha256").update(archiveBuffer).digest("hex");

const manifest = {
  version,
  file: archiveName,
  sha256,
  publishedAt: new Date().toISOString()
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Archive created: ${archivePath}`);
console.log(`Published manifest: ${manifestPath}`);
