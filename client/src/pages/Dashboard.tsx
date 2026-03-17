import { Users, Shield, AlertTriangle, Clock, Bell } from "lucide-react";
import KPICard from "@/components/KPICard";
import AlertCard from "@/components/AlertCard";
import RiskGauge from "@/components/RiskGauge";
import FinancialActionCard from "@/components/FinancialActionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/components/LanguageProvider";

export default function Dashboard() {
  const { t } = useLanguage();
  
  // todo: remove mock functionality
  const mockAlerts = [
    {
      id: "alert-1",
      riskLevel: "high" as const,
      location: "Mumbai, Maharashtra",
      timestamp: `2 ${t("hoursAgo")}`,
      weatherCondition: t("heavyRainfall"),
      temperature: "28°C",
      rainfall: "150mm",
      windSpeed: "45 km/h",
      recommendations: [
        t("moveSavings"),
        t("activateCropProtection"),
        t("secureLooseItems")
      ]
    },
    {
      id: "alert-2",
      riskLevel: "medium" as const,
      location: "Pune, Maharashtra",
      timestamp: `5 ${t("hoursAgo")}`,
      weatherCondition: t("moderateWind"),
      temperature: "26°C",
      windSpeed: "35 km/h",
      recommendations: [
        t("monitorWeather"),
        t("reviewInsurance")
      ]
    }
  ];

  const mockActions = [
    {
      id: "action-1",
      type: "insurance" as const,
      title: t("activateMicroInsurance"),
      description: t("microInsuranceDesc"),
      status: "recommended" as const,
      beforeAmount: `₹0 ${t("protected")}`,
      afterAmount: `₹50,000 ${t("protected")}`
    },
    {
      id: "action-2",
      type: "fund_protection" as const,
      title: t("transferToSafeAccount"),
      description: t("transferDesc"),
      status: "triggered" as const,
      beforeAmount: "₹25,000",
      afterAmount: `₹25,000 (${t("protected")})`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("dashboardTitle")}</h1>
          <p className="text-muted-foreground">{t("dashboardSubtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard title={t("currentRiskLevel")} value={t("highRiskLabel")} icon={AlertTriangle} trend="up" trendValue={t("fromMedium")} />
          <KPICard title={t("activeAlerts")} value="3" icon={Bell} />
          <KPICard title={t("protectedAmount")} value="₹75,000" icon={Shield} trend="up" trendValue={`+₹25,000 ${t("today")}`} />
          <KPICard title={t("nextCheck")} value="2h" icon={Clock} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <RiskGauge score={75} title={t("currentRiskScore")} />
          <RiskGauge score={45} title={t("sevenDayForecast")} />
          <RiskGauge score={20} title={t("thirtyDayOutlook")} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t("activeAlerts")}</h2>
              <Link href="/alerts">
                <Button variant="outline" size="sm" data-testid="button-view-all-alerts">
                  {t("viewAll")}
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {mockAlerts.map(alert => (
                <AlertCard key={alert.id} {...alert} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t("financialActions")}</h2>
            <div className="space-y-4">
              {mockActions.map(action => (
                <FinancialActionCard key={action.id} {...action} />
              ))}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: `10 ${t("minutesAgo")}`, event: "Alert triggered for Mumbai region", type: "alert" },
                { time: `2 ${t("hoursAgo")}`, event: "Insurance protection activated", type: "action" },
                { time: `5 ${t("hoursAgo")}`, event: "Risk level changed from Medium to High", type: "risk" },
                { time: `1 ${t("daysAgo")}`, event: "Fund transfer completed successfully", type: "success" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="font-medium">{item.event}</p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
