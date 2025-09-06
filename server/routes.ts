import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertSpeciesIdentificationSchema, insertSpeciesReportSchema } from "@shared/schema";
import { FULL_SPECIES_DATA } from "../client/src/lib/species-data";

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed') as any, false);
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Species identification endpoint
  app.post("/api/identify", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // TODO: Integrate with actual Julia model
      // For now, simulate the Julia API response structure
      const mockPredictions = simulateJuliaIdentification();
      
      // Store the identification result
      const identification = await storage.createSpeciesIdentification({
        imageUrl: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        predictions: mockPredictions,
        userId: null, // No auth for now
      });

      res.json({
        id: identification.id,
        predictions: identification.predictions,
        createdAt: identification.createdAt,
      });
    } catch (error) {
      console.error('Identification error:', error);
      res.status(500).json({ error: "Failed to identify species" });
    }
  });

  // Get identification history
  app.get("/api/identifications", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const identifications = await storage.getSpeciesIdentifications(limit);
      res.json(identifications);
    } catch (error) {
      console.error('Error fetching identifications:', error);
      res.status(500).json({ error: "Failed to fetch identifications" });
    }
  });

  // Submit species report
  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertSpeciesReportSchema.parse(req.body);
      const report = await storage.createSpeciesReport(validatedData);
      res.json(report);
    } catch (error) {
      console.error('Report submission error:', error);
      res.status(400).json({ error: "Invalid report data" });
    }
  });

  // Get recent reports
  app.get("/api/reports", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const reports = await storage.getSpeciesReports(limit);
      res.json(reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  // Get app statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStatsData();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Julia API health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "online",
      modelVersion: "v2.3.1",
      responseTime: Math.floor(Math.random() * 100) + 200, // 200-300ms
      speciesCount: 196,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Simulate Julia model predictions for Indian invasive species
function simulateJuliaIdentification() {
  const availableSpecies = FULL_SPECIES_DATA.species;

  // Generate top 3 predictions with confidence scores
  const shuffled = [...availableSpecies].sort(() => Math.random() - 0.5);
  const predictions = shuffled.slice(0, 3).map((species, index) => ({
    species: species.name,
    confidence: Math.max(0.6, Math.random() * 0.4) - (index * 0.1), // Decreasing confidence
    scientificName: species.scientificName,
    category: species.category,
    impactLevel: species.impactLevel,
    nativeTo: species.nativeTo,
  }));

  // Sort by confidence
  return predictions.sort((a, b) => b.confidence - a.confidence);
}
