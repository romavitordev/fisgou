import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const mode = process.argv[2] === "demo" ? "demo" : "empty";
const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

const env = {
  ...process.env,
  SEED_MODE: mode,
};

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env, stdio: "inherit", shell: true });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
    child.on("error", reject);
  });
}

console.log(`Iniciando modo ${mode}...`);

await run(pnpm, ["exec", "prisma", "db", "push", "--force-reset"]);
await run(pnpm, ["exec", "tsx", "prisma/seed.ts", mode]);
await run(pnpm, ["dev"]);
