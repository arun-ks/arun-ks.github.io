import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const astro = fileURLToPath(new URL("../node_modules/astro/astro.js", import.meta.url));
const result = spawnSync(process.execPath, [astro, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
});

process.exit(result.status ?? 1);
