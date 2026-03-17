import { z } from "zod";

// User Management
export interface User {
  id: string;
  username: string;
  password: string;
  role?: "user" | "admin";
  email?: string;
  location?: string;
}

export interface InsertUser {
  username: string;
  password: string;
  role?: "user" | "admin";
  email?: string;
  location?: string;
}

// Wallet & Accounts
export interface WalletAccount {
  id: string;
  userId: string;
  accountType: "wallet" | "emergency_savings";
  balance: number;
  currency: string;
  createdAt: number;
  updatedAt: number;
}

export interface InsertWalletAccount {
  userId: string;
  accountType: "wallet" | "emergency_savings";
  balance: number;
  currency: string;
}

// Transactions
export interface Transaction {
  id: string;
  userId: string;
  fromAccountId: string;
  toAccountId?: string;
  amount: number;
  transactionType: "deposit" | "withdrawal" | "transfer" | "auto_transfer";
  status: "pending" | "completed" | "failed";
  riskLevel?: "high" | "medium" | "low" | "safe";
  reason?: string;
  timestamp: number;
}

export interface InsertTransaction {
  userId: string;
  fromAccountId: string;
  toAccountId?: string;
  amount: number;
  transactionType: "deposit" | "withdrawal" | "transfer" | "auto_transfer";
  status: "pending" | "completed" | "failed";
  riskLevel?: "high" | "medium" | "low" | "safe";
  reason?: string;
}

// EMI (Equated Monthly Installment)
export interface EMI {
  id: string;
  userId: string;
  loanAmount: number;
  monthlyEMI: number;
  dueDate: number;
  status: "active" | "paused" | "completed";
  pausedUntil?: number;
  reason?: string;
  createdAt: number;
  updatedAt: number;
}

export interface InsertEMI {
  userId: string;
  loanAmount: number;
  monthlyEMI: number;
  dueDate: number;
  status: "active" | "paused" | "completed";
}

// Insurance
export interface Insurance {
  id: string;
  userId: string;
  insuranceType: "micro" | "crop" | "property" | "personal";
  coverageAmount: number;
  status: "active" | "inactive" | "triggered";
  activatedAt?: number;
  riskCondition?: string;
  createdAt: number;
}

export interface InsertInsurance {
  userId: string;
  insuranceType: "micro" | "crop" | "property" | "personal";
  coverageAmount: number;
  status: "active" | "inactive" | "triggered";
  riskCondition?: string;
}

// Weather & Risk Data
export interface WeatherData {
  id: string;
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  weatherCondition: string;
  timestamp: number;
}

export interface RiskPrediction {
  id: string;
  userId: string;
  location: string;
  riskLevel: "high" | "medium" | "low" | "safe";
  score: number;
  factors: {
    windImpact: number;
    rainfallImpact: number;
    humidityImpact: number;
    temperatureImpact: number;
  };
  timestamp: number;
}

// Action Logs
export interface ActionLog {
  id: string;
  userId: string;
  userName: string;
  location: string;
  actionType: "insurance" | "fund_transfer" | "emi_pause" | "alert_sent";
  status: "triggered" | "completed" | "failed";
  riskLevel: "high" | "medium" | "low" | "safe";
  details: string;
  timestamp: number;
}

export type InsertActionLog = Omit<ActionLog, "id" | "timestamp">;

// Chatbot Messages
export interface ChatMessage {
  id: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  language: string;
  timestamp: number;
}

export interface InsertChatMessage {
  userId: string;
  role: "user" | "assistant";
  content: string;
  language: string;
}

// Zod Schemas for Validation
export const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(["user", "admin"]).optional(),
  email: z.string().email().optional(),
  location: z.string().optional(),
});

export const insertWalletAccountSchema = z.object({
  userId: z.string(),
  accountType: z.enum(["wallet", "emergency_savings"]),
  balance: z.number().min(0),
  currency: z.string(),
});

export const insertTransactionSchema = z.object({
  userId: z.string(),
  fromAccountId: z.string(),
  toAccountId: z.string().optional(),
  amount: z.number().positive(),
  transactionType: z.enum(["deposit", "withdrawal", "transfer", "auto_transfer"]),
  status: z.enum(["pending", "completed", "failed"]),
  riskLevel: z.enum(["high", "medium", "low", "safe"]).optional(),
  reason: z.string().optional(),
});

export const insertEMISchema = z.object({
  userId: z.string(),
  loanAmount: z.number().positive(),
  monthlyEMI: z.number().positive(),
  dueDate: z.number(),
  status: z.enum(["active", "paused", "completed"]),
});

export const insertInsuranceSchema = z.object({
  userId: z.string(),
  insuranceType: z.enum(["micro", "crop", "property", "personal"]),
  coverageAmount: z.number().positive(),
  status: z.enum(["active", "inactive", "triggered"]),
  riskCondition: z.string().optional(),
});

export const insertActionLogSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  location: z.string(),
  actionType: z.enum(["insurance", "fund_transfer", "emi_pause", "alert_sent"]),
  status: z.enum(["triggered", "completed", "failed"]),
  riskLevel: z.enum(["high", "medium", "low", "safe"]),
  details: z.string(),
});

export const insertChatMessageSchema = z.object({
  userId: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  language: z.string(),
});
