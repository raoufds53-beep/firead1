import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertActionLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  function broadcast(data: object) {
    const msg = JSON.stringify(data);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  }

  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({ type: "connected", message: "Real-time updates active" }));
  });

  app.get("/api/action-logs", async (_req, res) => {
    const logs = await storage.getActionLogs();
    res.json(logs);
  });

  app.post("/api/action-logs", async (req, res) => {
    const result = insertActionLogSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid action log data" });
    }
    const log = await storage.createActionLog(result.data);
    broadcast({ type: "new_action", log });
    res.status(201).json(log);
  });

  return httpServer;
}
