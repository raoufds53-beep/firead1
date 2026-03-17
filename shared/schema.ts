import { z } from "zod";

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface InsertUser {
  username: string;
  password: string;
}

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

export const insertActionLogSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  location: z.string(),
  actionType: z.enum(["insurance", "fund_transfer", "emi_pause", "alert_sent"]),
  status: z.enum(["triggered", "completed", "failed"]),
  riskLevel: z.enum(["high", "medium", "low", "safe"]),
  details: z.string(),
});
