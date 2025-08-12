import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPrizeSchema, insertParticipantSchema, insertSubmissionSchema, insertSettingsSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const validatedData = insertSettingsSchema.parse(req.body);
      const settings = await storage.updateSettings(validatedData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  // Prize routes
  app.get("/api/prizes", async (req, res) => {
    try {
      const prizes = await storage.getAllPrizes();
      res.json(prizes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prizes" });
    }
  });

  app.post("/api/prizes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const validatedData = insertPrizeSchema.parse(req.body);
      const prize = await storage.createPrize(validatedData);
      res.status(201).json(prize);
    } catch (error) {
      res.status(400).json({ message: "Invalid prize data" });
    }
  });

  app.put("/api/prizes/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const { id } = req.params;
      const updates = insertPrizeSchema.partial().parse(req.body);
      const prize = await storage.updatePrize(id, updates);
      res.json(prize);
    } catch (error) {
      res.status(400).json({ message: "Failed to update prize" });
    }
  });

  app.delete("/api/prizes/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const { id } = req.params;
      const success = await storage.deletePrize(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Prize not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete prize" });
    }
  });

  // Participant routes
  app.get("/api/participants", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const participants = await storage.getAllParticipants();
      res.json(participants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });

  app.post("/api/participants", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const validatedData = insertParticipantSchema.parse(req.body);
      const participant = await storage.createParticipant(validatedData);
      res.status(201).json(participant);
    } catch (error) {
      res.status(400).json({ message: "Invalid participant data" });
    }
  });

  app.put("/api/participants/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const { id } = req.params;
      const updates = insertParticipantSchema.partial().parse(req.body);
      const participant = await storage.updateParticipant(id, updates);
      res.json(participant);
    } catch (error) {
      res.status(400).json({ message: "Failed to update participant" });
    }
  });

  app.delete("/api/participants/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const { id } = req.params;
      const success = await storage.deleteParticipant(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Participant not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete participant" });
    }
  });

  // Coupon checking route (public)
  app.post("/api/check-coupon", async (req, res) => {
    try {
      const submissionData = insertSubmissionSchema.parse(req.body);
      
      // Check if coupon exists in participants
      const participant = await storage.getParticipantByCoupon(submissionData.couponNumber);
      
      let isWinner = false;
      let prizeId = null;
      let prizeName = null;
      
      if (participant && participant.isWinner && participant.prizeId) {
        isWinner = true;
        prizeId = participant.prizeId;
        const prize = await storage.getPrize(participant.prizeId);
        prizeName = prize?.name || null;
      }
      
      // Save submission to history
      const submission = await storage.createSubmission({
        ...submissionData,
        isWinner,
        prizeId,
        prizeName,
      });
      
      res.json({
        isWinner,
        prizeName,
        message: isWinner 
          ? (await storage.getSettings())?.winnerMessage || "Selamat! Anda mendapat hadiah!"
          : "Maaf, nomor kupon Anda tidak mendapatkan hadiah kali ini."
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid submission data" });
    }
  });

  // Submissions routes
  app.get("/api/submissions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const { search } = req.query;
      const submissions = search 
        ? await storage.searchSubmissions(search as string)
        : await storage.getAllSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
