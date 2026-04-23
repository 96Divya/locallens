import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildTripPlan, loadModel, trainModel } from "./planner.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "public", "data");
const modelPath = path.join(rootDir, "backend", "model", "trained-model.json");
const port = Number(process.env.PORT || 8787);

async function ensureModel() {
  try {
    return await loadModel(modelPath);
  } catch {
    return trainModel({ dataDir, outputPath: modelPath });
  }
}

let model = await ensureModel();

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(raw ? JSON.parse(raw) : {}));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.url === "/api/health" && req.method === "GET") {
    sendJson(res, 200, {
      ok: true,
      modelGeneratedAt: model.generatedAt,
      stats: model.stats,
    });
    return;
  }

  if (req.url === "/api/train" && req.method === "POST") {
    try {
      model = await trainModel({ dataDir, outputPath: modelPath });
      sendJson(res, 200, {
        ok: true,
        message: "Model trained successfully.",
        generatedAt: model.generatedAt,
        stats: model.stats,
      });
    } catch (error) {
      sendJson(res, 500, { ok: false, error: error.message });
    }
    return;
  }

  if (req.url === "/api/plan" && req.method === "POST") {
    try {
      const body = await readBody(req);
      const required = ["stateName", "days", "budgetKey", "styleKey", "stateInfo"];
      const missing = required.filter((key) => !(key in body));
      if (missing.length) {
        sendJson(res, 400, { ok: false, error: `Missing required fields: ${missing.join(", ")}` });
        return;
      }

      const plan = buildTripPlan({
        model,
        stateName: body.stateName,
        selectedPlaces: body.selectedPlaces || [],
        days: Number(body.days),
        budgetKey: body.budgetKey,
        styleKey: body.styleKey,
        stateInfo: body.stateInfo,
        hiddenExtra: body.hiddenExtra || [],
      });

      sendJson(res, 200, { ok: true, plan });
    } catch (error) {
      sendJson(res, 500, { ok: false, error: error.message });
    }
    return;
  }

  sendJson(res, 404, { ok: false, error: "Not found" });
});

server.listen(port, () => {
  console.log(`LocalLens backend listening on http://localhost:${port}`);
});
