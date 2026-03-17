import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Activity, TrendingUp, Zap, Shield } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { ActionLog } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

const ACTION_COLORS: Record<string, string> = {
  insurance: "#3b82f6",
  fund_transfer: "#22c55e",
  emi_pause: "#f59e0b",
  alert_sent: "#8b5cf6",
};

const STATUS_COLORS: Record<string, string> = {
  completed: "#22c55e",
  triggered: "#3b82f6",
  failed: "#ef4444",
};

function timeAgo(ts: number): string {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ActionLog() {
  const { t } = useLanguage();
  const [wsConnected, setWsConnected] = useState(false);

  const { data: logs = [], isLoading } = useQuery<ActionLog[]>({
    queryKey: ["/api/action-logs"],
  });

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onopen = () => setWsConnected(true);
    ws.onclose = () => setWsConnected(false);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_action") {
        queryClient.invalidateQueries({ queryKey: ["/api/action-logs"] });
      }
    };

    return () => ws.close();
  }, []);

  const actionTypeData = ["insurance", "fund_transfer", "emi_pause", "alert_sent"].map(type => ({
    name: type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()),
    count: logs.filter(l => l.actionType === type).length,
    fill: ACTION_COLORS[type],
  }));

  const statusData = ["completed", "triggered", "failed"].map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: logs.filter(l => l.status === status).length,
    fill: STATUS_COLORS[status],
  }));

  const riskData = ["high", "medium", "low", "safe"].map(level => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    count: logs.filter(l => l.riskLevel === level).length,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Financial Action Log</h1>
            <p className="text-muted-foreground">Real-time log of all triggered financial actions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${wsConnected ? "bg-green-500" : "bg-muted"}`} />
            <span className="text-sm text-muted-foreground">
              {wsConnected ? "Live updates active" : "Connecting..."}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Actions</p>
                  <p className="text-2xl font-bold">{logs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{logs.filter(l => l.status === "completed").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Triggered</p>
                  <p className="text-2xl font-bold">{logs.filter(l => l.status === "triggered").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">High Risk Actions</p>
                  <p className="text-2xl font-bold">{logs.filter(l => l.riskLevel === "high").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Actions by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={actionTypeData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {actionTypeData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Action Log
              {isLoading && <span className="text-sm font-normal text-muted-foreground">Loading...</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map(log => (
                  <TableRow key={log.id} data-testid={`row-action-log-${log.id}`}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {timeAgo(log.timestamp)}
                    </TableCell>
                    <TableCell className="font-medium text-sm">{log.userName}</TableCell>
                    <TableCell className="text-sm">{log.location}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        style={{ borderColor: ACTION_COLORS[log.actionType], color: ACTION_COLORS[log.actionType] }}
                        className="text-xs whitespace-nowrap"
                      >
                        {log.actionType.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="text-xs"
                        variant={log.riskLevel === "high" ? "destructive" : "outline"}
                      >
                        {log.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className="text-xs font-medium"
                        style={{ color: STATUS_COLORS[log.status] }}
                      >
                        {log.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-48 truncate">
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
