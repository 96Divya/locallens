import path from "node:path";
import { fileURLToPath } from "node:url";
import { trainModel } from "./planner.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "public", "data");
const outputPath = path.join(rootDir, "backend", "model", "trained-model.json");

const model = await trainModel({ dataDir, outputPath });

console.log("Model trained successfully.");
console.log(`Output: ${outputPath}`);
console.log(
  JSON.stringify(
    {
      generatedAt: model.generatedAt,
      stats: model.stats,
    },
    null,
    2,
  ),
);
