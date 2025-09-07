// routes.ts (drop-in improvements)
import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertSpeciesReportSchema } from "@shared/schema";
import fs from "fs/promises";
import path from "path";

const JULIA_URL = process.env.JULIA_URL || "http://127.0.0.1:9000";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Only image files are allowed") as any, false),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/identify", upload.single("image"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No image file provided" });

    const ext = (req.file.originalname.split(".").pop() || "jpg").toLowerCase();
    const tmpPath = path.join("/tmp", `img-${Date.now()}.${ext}`);
    const topk = Math.max(1, parseInt((req.body?.topk as string) || "3", 10) || 3);
    const region_code = (req.body?.region_code as string) || null;

    try {
      await fs.writeFile(tmpPath, req.file.buffer);

      // timeout with AbortController
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 10_000);

      const resp = await fetch(`${JULIA_URL}/infer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_path: tmpPath, region_code, topk }),
        signal: controller.signal,
      });

      clearTimeout(t);

      if (!resp.ok) {
        const errText = await resp.text();
        return res.status(502).json({ error: `Julia API error: ${errText}` });
      }

      const data = (await resp.json()) as { species: string[]; scores: number[] };

      const predictions = (data.species || []).map((s, i) => ({
        species: s,
        confidence: Number((data.scores || [])[i] ?? 0),
      }));

      const identification = await storage.createSpeciesIdentification({
        imageUrl: `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        predictions,
        userId: null,
      });

      return res.json({
        id: identification.id,
        predictions: identification.predictions,
        createdAt: identification.createdAt,
      });
    } catch (e) {
      console.error("Identification error:", e);
      return res.status(500).json({ error: "Failed to identify species" });
    } finally {
      await fs.unlink(tmpPath).catch(() => {});
    }
  });

  // ...keep your other routes here...

  const httpServer = createServer(app);
  return httpServer;
}
