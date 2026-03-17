import { Users, Shield, Bell, Activity, MapPin, TrendingUp } from "lucide-react";
import KPICard from "@/components/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RiskLevelBadge from "@/components/RiskLevelBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/components/LanguageProvider";

export default function AdminDashboard() {
  const { t } = useLanguage();
  // todo: remove mock functionality
  const riskZones = [
    { id: 1, location: "Mumbai, Maharashtra", users: 342, riskLevel: "high" as const, alerts: 12 },
    { id: 2, location: "Pune, Maharashtra", users: 198, riskLevel: "medium" as const, alerts: 5 },
    { id: 3, location: "Nashik, Maharashtra", users: 156, riskLevel: "high" as const, alerts: 8 },
    { id: 4, location: "Thane, Maharashtra", users: 89, riskLevel: "low" as const, alerts: 2 },
    { id: 5, location: "Nagpur, Maharashtra", users: 234, riskLevel: "safe" as const, alerts: 0 }
  ];

  const recentActions = [
    { id: 1, user: "Rajesh Kumar", location: "Mumbai", action: "Insurance Activated", status: "completed", time: "5 min ago" },
    { id: 2, user: "Priya Sharma", location: "Pune", action: "Fund Transfer", status: "triggered", time: "12 min ago" },
    { id: 3, user: "Amit Patel", location: "Nashik", action: "EMI Pause", status: "completed", time: "25 min ago" },
    { id: 4, user: "Sunita Desai", location: "Mumbai", action: "Insurance Activated", status: "triggered", time: "1 hour ago" },
    { id: 5, user: "Vikram Singh", location: "Thane", action: "Fund Transfer", status: "completed", time: "2 hours ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("adminDashboardTitle")}</h1>
          <p className="text-muted-foreground">{t("adminDashboardSubtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard title={t("totalUsers")} value="1,247" icon={Users} trend="up" trendValue={`+12% ${t("thisMonth")}`} />
          <KPICard title={t("activeAlerts")} value="23" icon={Bell} trend="down" trendValue={`-5% ${t("today")}`} />
          <KPICard title={t("protectedFamilies")} value="892" icon={Shield} trend="up" trendValue={`+18% ${t("thisWeek")}`} />
          <KPICard title={t("avgResponseTime")} value="2.4m" icon={Activity} trend="neutral" trendValue={t("lastWeek")} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t("activeRiskZones")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("location")}</TableHead>
                    <TableHead>{t("users")}</TableHead>
                    <TableHead>{t("riskLevel")}</TableHead>
                    <TableHead>{t("alerts")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riskZones.map((zone) => (
                    <TableRow key={zone.id} data-testid={`row-risk-zone-${zone.id}`}>
                      <TableCell className="font-medium">{zone.location}</TableCell>
                      <TableCell>{zone.users}</TableCell>
                      <TableCell>
                        <RiskLevelBadge level={zone.riskLevel} />
                      </TableCell>
                      <TableCell>{zone.alerts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t("recentFinancialActions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-medium">{action.user}</p>
                      <p className="text-sm text-muted-foreground">{action.location} • {action.action}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={action.status === "completed" ? "outline" : "default"}>
                        {t(action.status)}
                      </Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{action.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t("systemPerformance")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t("alertSuccessRate")}</p>
                <p className="text-2xl font-bold">94.5%</p>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-risk-safe" style={{ width: "94.5%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t("actionCompletionRate")}</p>
                <p className="text-2xl font-bold">87.2%</p>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "87.2%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t("userEngagement")}</p>
                <p className="text-2xl font-bold">71.8%</p>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-risk-medium" style={{ width: "71.8%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
