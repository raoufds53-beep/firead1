import {
  type User,
  type InsertUser,
  type ActionLog,
  type InsertActionLog,
  type WalletAccount,
  type InsertWalletAccount,
  type Transaction,
  type InsertTransaction,
  type EMI,
  type InsertEMI,
  type Insurance,
  type InsertInsurance,
  type WeatherData,
  type RiskPrediction,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User Management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Wallet Accounts
  getWalletAccount(id: string): Promise<WalletAccount | undefined>;
  getUserWalletAccounts(userId: string): Promise<WalletAccount[]>;
  createWalletAccount(account: InsertWalletAccount): Promise<WalletAccount>;
  updateWalletBalance(accountId: string, amount: number): Promise<WalletAccount>;

  // Transactions
  getTransaction(id: string): Promise<Transaction | undefined>;
  getUserTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(transactionId: string, status: "pending" | "completed" | "failed"): Promise<Transaction>;

  // EMI
  getEMI(id: string): Promise<EMI | undefined>;
  getUserEMI(userId: string): Promise<EMI[]>;
  createEMI(emi: InsertEMI): Promise<EMI>;
  pauseEMI(emiId: string, pauseUntil: number): Promise<EMI>;
  resumeEMI(emiId: string): Promise<EMI>;

  // Insurance
  getInsurance(id: string): Promise<Insurance | undefined>;
  getUserInsurance(userId: string): Promise<Insurance[]>;
  createInsurance(insurance: InsertInsurance): Promise<Insurance>;
  activateInsurance(insuranceId: string): Promise<Insurance>;

  // Action Logs
  getActionLogs(): Promise<ActionLog[]>;
  getUserActionLogs(userId: string): Promise<ActionLog[]>;
  createActionLog(log: InsertActionLog): Promise<ActionLog>;

  // Weather & Risk Data
  getAllWeatherData(): Promise<WeatherData[]>;
  getWeatherByLocation(location: string): Promise<WeatherData[]>;
  createWeatherData(data: WeatherData): Promise<WeatherData>;
  getAllRiskPredictions(): Promise<RiskPrediction[]>;
  getUserRiskPrediction(userId: string): Promise<RiskPrediction | undefined>;
  createRiskPrediction(prediction: RiskPrediction): Promise<RiskPrediction>;

  // Chat Messages
  getChatHistory(userId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

const MOCK_ACTION_LOGS: ActionLog[] = [
  { id: "1", userId: "u1", userName: "Rajesh Kumar", location: "Mumbai", actionType: "insurance", status: "completed", riskLevel: "high", details: "Micro-insurance activated for flood risk", timestamp: Date.now() - 5 * 60000 },
  { id: "2", userId: "u2", userName: "Priya Sharma", location: "Pune", actionType: "fund_transfer", status: "triggered", riskLevel: "medium", details: "₹25,000 transferred to safe account", timestamp: Date.now() - 12 * 60000 },
  { id: "3", userId: "u3", userName: "Amit Patel", location: "Nashik", actionType: "emi_pause", status: "completed", riskLevel: "high", details: "Loan EMI paused for 3 months", timestamp: Date.now() - 25 * 60000 },
  { id: "4", userId: "u4", userName: "Sunita Desai", location: "Mumbai", actionType: "insurance", status: "triggered", riskLevel: "high", details: "Crop protection fund activated", timestamp: Date.now() - 60 * 60000 },
  { id: "5", userId: "u5", userName: "Vikram Singh", location: "Thane", actionType: "fund_transfer", status: "completed", riskLevel: "low", details: "₹10,000 moved to safe savings", timestamp: Date.now() - 2 * 60 * 60000 },
];

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private walletAccounts: Map<string, WalletAccount>;
  private transactions: Map<string, Transaction>;
  private emis: Map<string, EMI>;
  private insurances: Map<string, Insurance>;
  private actionLogs: ActionLog[];
  private weatherData: WeatherData[];
  private riskPredictions: Map<string, RiskPrediction>;
  private chatMessages: ChatMessage[];

  constructor() {
    this.users = new Map();
    this.walletAccounts = new Map();
    this.transactions = new Map();
    this.emis = new Map();
    this.insurances = new Map();
    this.actionLogs = [...MOCK_ACTION_LOGS];
    this.weatherData = [];
    this.riskPredictions = new Map();
    this.chatMessages = [];
  }

  // User Management
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, role: insertUser.role || "user" };
    this.users.set(id, user);
    return user;
  }

  // Wallet Accounts
  async getWalletAccount(id: string): Promise<WalletAccount | undefined> {
    return this.walletAccounts.get(id);
  }

  async getUserWalletAccounts(userId: string): Promise<WalletAccount[]> {
    return Array.from(this.walletAccounts.values()).filter(a => a.userId === userId);
  }

  async createWalletAccount(account: InsertWalletAccount): Promise<WalletAccount> {
    const id = randomUUID();
    const newAccount: WalletAccount = {
      ...account,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.walletAccounts.set(id, newAccount);
    return newAccount;
  }

  async updateWalletBalance(accountId: string, amount: number): Promise<WalletAccount> {
    const account = this.walletAccounts.get(accountId);
    if (!account) throw new Error("Account not found");
    account.balance = amount;
    account.updatedAt = Date.now();
    this.walletAccounts.set(accountId, account);
    return account;
  }

  // Transactions
  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const newTransaction: Transaction = {
      ...transaction,
      id,
      timestamp: Date.now(),
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  async updateTransactionStatus(
    transactionId: string,
    status: "pending" | "completed" | "failed"
  ): Promise<Transaction> {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error("Transaction not found");
    transaction.status = status;
    this.transactions.set(transactionId, transaction);
    return transaction;
  }

  // EMI
  async getEMI(id: string): Promise<EMI | undefined> {
    return this.emis.get(id);
  }

  async getUserEMI(userId: string): Promise<EMI[]> {
    return Array.from(this.emis.values()).filter(e => e.userId === userId);
  }

  async createEMI(emi: InsertEMI): Promise<EMI> {
    const id = randomUUID();
    const newEMI: EMI = {
      ...emi,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.emis.set(id, newEMI);
    return newEMI;
  }

  async pauseEMI(emiId: string, pauseUntil: number): Promise<EMI> {
    const emi = this.emis.get(emiId);
    if (!emi) throw new Error("EMI not found");
    emi.status = "paused";
    emi.pausedUntil = pauseUntil;
    emi.updatedAt = Date.now();
    this.emis.set(emiId, emi);
    return emi;
  }

  async resumeEMI(emiId: string): Promise<EMI> {
    const emi = this.emis.get(emiId);
    if (!emi) throw new Error("EMI not found");
    emi.status = "active";
    emi.pausedUntil = undefined;
    emi.updatedAt = Date.now();
    this.emis.set(emiId, emi);
    return emi;
  }

  // Insurance
  async getInsurance(id: string): Promise<Insurance | undefined> {
    return this.insurances.get(id);
  }

  async getUserInsurance(userId: string): Promise<Insurance[]> {
    return Array.from(this.insurances.values()).filter(i => i.userId === userId);
  }

  async createInsurance(insurance: InsertInsurance): Promise<Insurance> {
    const id = randomUUID();
    const newInsurance: Insurance = {
      ...insurance,
      id,
      createdAt: Date.now(),
    };
    this.insurances.set(id, newInsurance);
    return newInsurance;
  }

  async activateInsurance(insuranceId: string): Promise<Insurance> {
    const insurance = this.insurances.get(insuranceId);
    if (!insurance) throw new Error("Insurance not found");
    insurance.status = "triggered";
    insurance.activatedAt = Date.now();
    this.insurances.set(insuranceId, insurance);
    return insurance;
  }

  // Action Logs
  async getActionLogs(): Promise<ActionLog[]> {
    return [...this.actionLogs].sort((a, b) => b.timestamp - a.timestamp);
  }

  async getUserActionLogs(userId: string): Promise<ActionLog[]> {
    return this.actionLogs
      .filter(log => log.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  async createActionLog(log: InsertActionLog): Promise<ActionLog> {
    const newLog: ActionLog = { ...log, id: randomUUID(), timestamp: Date.now() };
    this.actionLogs.unshift(newLog);
    return newLog;
  }

  // Weather & Risk Data
  async getAllWeatherData(): Promise<WeatherData[]> {
    return this.weatherData;
  }

  async getWeatherByLocation(location: string): Promise<WeatherData[]> {
    return this.weatherData.filter(w => w.location === location);
  }

  async createWeatherData(data: WeatherData): Promise<WeatherData> {
    this.weatherData.push(data);
    return data;
  }

  async getAllRiskPredictions(): Promise<RiskPrediction[]> {
    return Array.from(this.riskPredictions.values())
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  async getUserRiskPrediction(userId: string): Promise<RiskPrediction | undefined> {
    return Array.from(this.riskPredictions.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
  }

  async createRiskPrediction(prediction: RiskPrediction): Promise<RiskPrediction> {
    this.riskPredictions.set(prediction.id, prediction);
    return prediction;
  }

  // Chat Messages
  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    return this.chatMessages
      .filter(m => m.userId === userId)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      ...message,
      id: randomUUID(),
      timestamp: Date.now(),
    };
    this.chatMessages.push(newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
