import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import {
  insertActionLogSchema,
  insertWalletAccountSchema,
  insertTransactionSchema,
  insertEMISchema,
  insertInsuranceSchema,
  insertChatMessageSchema,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { aiChatbotService } from "./services/aiChatbotService";

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

  // ===== ACTION LOGS =====
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

  app.get("/api/action-logs/user/:userId", async (req, res) => {
    const logs = await storage.getUserActionLogs(req.params.userId);
    res.json(logs);
  });

  // ===== WALLET ACCOUNTS =====
  app.get("/api/wallet/:userId", async (req, res) => {
    const accounts = await storage.getUserWalletAccounts(req.params.userId);
    res.json(accounts);
  });

  app.post("/api/wallet", async (req, res) => {
    const result = insertWalletAccountSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid wallet account data" });
    }
    const account = await storage.createWalletAccount(result.data);
    res.status(201).json(account);
  });

  app.post("/api/wallet/:accountId/deposit", async (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    const account = await storage.getWalletAccount(req.params.accountId);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    const updated = await storage.updateWalletBalance(req.params.accountId, account.balance + amount);
    res.json(updated);
  });

  app.post("/api/wallet/:accountId/withdraw", async (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    const account = await storage.getWalletAccount(req.params.accountId);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    if (account.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    const updated = await storage.updateWalletBalance(req.params.accountId, account.balance - amount);
    res.json(updated);
  });

  // ===== TRANSACTIONS =====
  app.get("/api/transactions/:userId", async (req, res) => {
    const transactions = await storage.getUserTransactions(req.params.userId);
    res.json(transactions);
  });

  app.post("/api/transactions", async (req, res) => {
    const result = insertTransactionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid transaction data" });
    }
    const transaction = await storage.createTransaction(result.data);
    broadcast({ type: "new_transaction", transaction });
    res.status(201).json(transaction);
  });

  app.post("/api/transactions/auto-transfer", async (req, res) => {
    const { userId, fromAccountId, toAccountId, amount, riskLevel } = req.body;
    
    const fromAccount = await storage.getWalletAccount(fromAccountId);
    const toAccount = await storage.getWalletAccount(toAccountId);
    
    if (!fromAccount || !toAccount) {
      return res.status(404).json({ error: "Account not found" });
    }
    
    if (fromAccount.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    
    // Perform the transfer
    await storage.updateWalletBalance(fromAccountId, fromAccount.balance - amount);
    await storage.updateWalletBalance(toAccountId, toAccount.balance + amount);
    
    // Create transaction record
    const transaction = await storage.createTransaction({
      userId,
      fromAccountId,
      toAccountId,
      amount,
      transactionType: "auto_transfer",
      status: "completed",
      riskLevel,
      reason: `Automatic transfer triggered by ${riskLevel === "high" ? "high risk" : "user action"}`,
    });
    
    broadcast({ type: "auto_transfer", transaction, fromAccount: { ...fromAccount, balance: fromAccount.balance - amount }, toAccount: { ...toAccount, balance: toAccount.balance + amount } });
    res.status(201).json(transaction);
  });

  // ===== EMI MANAGEMENT =====
  app.get("/api/emi/:userId", async (req, res) => {
    const emis = await storage.getUserEMI(req.params.userId);
    res.json(emis);
  });

  app.post("/api/emi", async (req, res) => {
    const result = insertEMISchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid EMI data" });
    }
    const emi = await storage.createEMI(result.data);
    res.status(201).json(emi);
  });

  app.post("/api/emi/:emiId/pause", async (req, res) => {
    const { pauseMonths = 3 } = req.body;
    const pauseUntil = Date.now() + pauseMonths * 30 * 24 * 60 * 60 * 1000;
    const emi = await storage.pauseEMI(req.params.emiId, pauseUntil);
    
    const actionLog = await storage.createActionLog({
      userId: emi.userId,
      userName: "System",
      location: "System",
      actionType: "emi_pause",
      status: "completed",
      riskLevel: "high",
      details: `EMI paused for ${pauseMonths} months`,
    });
    
    broadcast({ type: "emi_paused", emi, actionLog });
    res.json(emi);
  });

  app.post("/api/emi/:emiId/resume", async (req, res) => {
    const emi = await storage.resumeEMI(req.params.emiId);
    
    const actionLog = await storage.createActionLog({
      userId: emi.userId,
      userName: "System",
      location: "System",
      actionType: "emi_pause",
      status: "completed",
      riskLevel: "low",
      details: "EMI resumed",
    });
    
    broadcast({ type: "emi_resumed", emi, actionLog });
    res.json(emi);
  });

  // ===== INSURANCE =====
  app.get("/api/insurance/:userId", async (req, res) => {
    const insurances = await storage.getUserInsurance(req.params.userId);
    res.json(insurances);
  });

  app.post("/api/insurance", async (req, res) => {
    const result = insertInsuranceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid insurance data" });
    }
    const insurance = await storage.createInsurance(result.data);
    res.status(201).json(insurance);
  });

  app.post("/api/insurance/:insuranceId/activate", async (req, res) => {
    const insurance = await storage.activateInsurance(req.params.insuranceId);
    
    const actionLog = await storage.createActionLog({
      userId: insurance.userId,
      userName: "System",
      location: "System",
      actionType: "insurance",
      status: "triggered",
      riskLevel: "high",
      details: `${insurance.insuranceType} insurance activated for ₹${insurance.coverageAmount}`,
    });
    
    broadcast({ type: "insurance_activated", insurance, actionLog });
    res.json(insurance);
  });

  // ===== RISK PREDICTIONS =====
  app.get("/api/risk/:userId", async (req, res) => {
    const prediction = await storage.getUserRiskPrediction(req.params.userId);
    res.json(prediction);
  });

  app.get("/api/risk/all", async (req, res) => {
    const predictions = await storage.getAllRiskPredictions();
    res.json(predictions);
  });

  app.post("/api/risk", async (req, res) => {
    const { userId, location, riskLevel, score, factors } = req.body;
    const prediction = await storage.createRiskPrediction({
      id: randomUUID(),
      userId,
      location,
      riskLevel,
      score,
      factors,
      timestamp: Date.now(),
    });
    broadcast({ type: "risk_prediction", prediction });
    res.status(201).json(prediction);
  });

  // ===== WEATHER DATA =====
  app.get("/api/weather/location/:location", async (req, res) => {
    const data = await storage.getWeatherByLocation(req.params.location);
    res.json(data);
  });

  app.post("/api/weather", async (req, res) => {
    const { location, temperature, humidity, windSpeed, rainfall, weatherCondition } = req.body;
    const weatherData = await storage.createWeatherData({
      id: randomUUID(),
      location,
      temperature,
      humidity,
      windSpeed,
      rainfall,
      weatherCondition,
      timestamp: Date.now(),
    });
    broadcast({ type: "weather_update", weatherData });
    res.status(201).json(weatherData);
  });

  // ===== CHAT MESSAGES =====
  app.get("/api/chat/:userId", async (req, res) => {
    const messages = await storage.getChatHistory(req.params.userId);
    res.json(messages);
  });

  app.post("/api/chat", async (req, res) => {
    const result = insertChatMessageSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid message data" });
    }
    const message = await storage.createChatMessage(result.data);
    broadcast({ type: "chat_message", message });
    res.status(201).json(message);
  });

  // ===== AI CHATBOT ENDPOINT =====
  app.post("/api/ai-chat", async (req, res) => {
    const { userId, message, language = "en" } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "Missing userId or message" });
    }

    try {
      // Save user message
      const userMsg = await storage.createChatMessage({
        userId,
        role: "user",
        content: message,
        language,
      });

      // Get AI response
      const conversationHistory = (await storage.getChatHistory(userId))
        .map(m => `${m.role}: ${m.content}`)
        .join("\n");

      const aiResponse = await aiChatbotService.getChatResponse(message, conversationHistory);

      // Save AI response
      const assistantMsg = await storage.createChatMessage({
        userId,
        role: "assistant",
        content: aiResponse,
        language,
      });

      broadcast({ type: "chat_response", userMessage: userMsg, assistantMessage: assistantMsg });
      res.json({ userMessage: userMsg, assistantMessage: assistantMsg });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  return httpServer;
}
