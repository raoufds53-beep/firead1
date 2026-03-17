import { type User, type InsertUser, type ActionLog, type InsertActionLog } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getActionLogs(): Promise<ActionLog[]>;
  createActionLog(log: InsertActionLog): Promise<ActionLog>;
}

const MOCK_ACTION_LOGS: ActionLog[] = [
  { id: "1", userId: "u1", userName: "Rajesh Kumar", location: "Mumbai", actionType: "insurance", status: "completed", riskLevel: "high", details: "Micro-insurance activated for flood risk", timestamp: Date.now() - 5 * 60000 },
  { id: "2", userId: "u2", userName: "Priya Sharma", location: "Pune", actionType: "fund_transfer", status: "triggered", riskLevel: "medium", details: "₹25,000 transferred to safe account", timestamp: Date.now() - 12 * 60000 },
  { id: "3", userId: "u3", userName: "Amit Patel", location: "Nashik", actionType: "emi_pause", status: "completed", riskLevel: "high", details: "Loan EMI paused for 3 months", timestamp: Date.now() - 25 * 60000 },
  { id: "4", userId: "u4", userName: "Sunita Desai", location: "Mumbai", actionType: "insurance", status: "triggered", riskLevel: "high", details: "Crop protection fund activated", timestamp: Date.now() - 60 * 60000 },
  { id: "5", userId: "u5", userName: "Vikram Singh", location: "Thane", actionType: "fund_transfer", status: "completed", riskLevel: "low", details: "₹10,000 moved to safe savings", timestamp: Date.now() - 2 * 60 * 60000 },
  { id: "6", userId: "u6", userName: "Anita Joshi", location: "Nagpur", actionType: "alert_sent", status: "completed", riskLevel: "safe", details: "Routine weather alert sent", timestamp: Date.now() - 3 * 60 * 60000 },
  { id: "7", userId: "u7", userName: "Ravi Gupta", location: "Mumbai", actionType: "insurance", status: "completed", riskLevel: "high", details: "Emergency insurance triggered", timestamp: Date.now() - 4 * 60 * 60000 },
  { id: "8", userId: "u8", userName: "Meena Patil", location: "Pune", actionType: "emi_pause", status: "failed", riskLevel: "medium", details: "EMI pause request pending bank approval", timestamp: Date.now() - 5 * 60 * 60000 },
  { id: "9", userId: "u1", userName: "Rajesh Kumar", location: "Mumbai", actionType: "fund_transfer", status: "completed", riskLevel: "high", details: "₹50,000 emergency transfer completed", timestamp: Date.now() - 6 * 60 * 60000 },
  { id: "10", userId: "u9", userName: "Kavita Shah", location: "Nashik", actionType: "alert_sent", status: "completed", riskLevel: "high", details: "Flood warning alert sent to 342 users", timestamp: Date.now() - 7 * 60 * 60000 },
  { id: "11", userId: "u10", userName: "Suresh Nair", location: "Thane", actionType: "insurance", status: "triggered", riskLevel: "medium", details: "Wind damage coverage activated", timestamp: Date.now() - 8 * 60 * 60000 },
  { id: "12", userId: "u11", userName: "Deepa Kulkarni", location: "Nagpur", actionType: "fund_transfer", status: "completed", riskLevel: "low", details: "Preventive fund transfer of ₹15,000", timestamp: Date.now() - 10 * 60 * 60000 },
  { id: "13", userId: "u12", userName: "Arun Mehta", location: "Mumbai", actionType: "emi_pause", status: "completed", riskLevel: "high", details: "Home loan EMI paused for disaster period", timestamp: Date.now() - 12 * 60 * 60000 },
  { id: "14", userId: "u13", userName: "Pooja Verma", location: "Pune", actionType: "alert_sent", status: "completed", riskLevel: "medium", details: "Moderate wind advisory sent", timestamp: Date.now() - 14 * 60 * 60000 },
  { id: "15", userId: "u14", userName: "Kiran Bhat", location: "Nashik", actionType: "insurance", status: "completed", riskLevel: "high", details: "Crop flood insurance activated", timestamp: Date.now() - 16 * 60 * 60000 },
  { id: "16", userId: "u15", userName: "Neha Rao", location: "Thane", actionType: "fund_transfer", status: "triggered", riskLevel: "medium", details: "₹30,000 transfer in progress", timestamp: Date.now() - 18 * 60 * 60000 },
  { id: "17", userId: "u16", userName: "Dinesh Choudhary", location: "Nagpur", actionType: "alert_sent", status: "completed", riskLevel: "safe", details: "All-clear status notification sent", timestamp: Date.now() - 20 * 60 * 60000 },
  { id: "18", userId: "u17", userName: "Geeta Pillai", location: "Mumbai", actionType: "emi_pause", status: "completed", riskLevel: "high", details: "Business loan EMI paused", timestamp: Date.now() - 22 * 60 * 60000 },
  { id: "19", userId: "u18", userName: "Mohan Tiwari", location: "Pune", actionType: "insurance", status: "failed", riskLevel: "medium", details: "Insurance activation pending verification", timestamp: Date.now() - 23 * 60 * 60000 },
  { id: "20", userId: "u19", userName: "Shalini Dubey", location: "Nashik", actionType: "fund_transfer", status: "completed", riskLevel: "high", details: "₹75,000 emergency fund transfer", timestamp: Date.now() - 24 * 60 * 60000 },
];

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private actionLogs: ActionLog[];

  constructor() {
    this.users = new Map();
    this.actionLogs = [...MOCK_ACTION_LOGS];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getActionLogs(): Promise<ActionLog[]> {
    return [...this.actionLogs].sort((a, b) => b.timestamp - a.timestamp);
  }

  async createActionLog(log: InsertActionLog): Promise<ActionLog> {
    const newLog: ActionLog = { ...log, id: randomUUID(), timestamp: Date.now() };
    this.actionLogs.unshift(newLog);
    return newLog;
  }
}

export const storage = new MemStorage();
