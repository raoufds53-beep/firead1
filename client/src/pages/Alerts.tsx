import { useState } from "react";
import AlertCard from "@/components/AlertCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Alerts() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

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
        t("secureLooseItems"),
        t("stockEssentials")
      ],
      status: "active"
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
      ],
      status: "active"
    },
    {
      id: "alert-3",
      riskLevel: "high" as const,
      location: "Nashik, Maharashtra",
      timestamp: `1 ${t("daysAgo")}`,
      weatherCondition: t("floodWarning"),
      temperature: "27°C",
      rainfall: "200mm",
      recommendations: [
        t("evacuateLowLying"),
        t("activateEmergencyInsurance")
      ],
      status: "past"
    },
    {
      id: "alert-4",
      riskLevel: "low" as const,
      location: "Thane, Maharashtra",
      timestamp: `3 ${t("daysAgo")}`,
      weatherCondition: t("lightRainfall"),
      temperature: "25°C",
      rainfall: "20mm",
      status: "past"
    }
  ];

  const activeAlerts = mockAlerts.filter(a => a.status === "active");
  const pastAlerts = mockAlerts.filter(a => a.status === "past");
  const highRiskAlerts = mockAlerts.filter(a => a.riskLevel === "high");

  const filterAlerts = (alerts: typeof mockAlerts) => {
    if (!searchQuery) return alerts;
    return alerts.filter(alert => 
      alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.weatherCondition.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("alertsTitle")}</h1>
          <p className="text-muted-foreground">{t("alertsSubtitle")}</p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchAlerts")}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-alerts"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all" data-testid="tab-all-alerts">
              {t("all")} ({mockAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="active" data-testid="tab-active-alerts">
              {t("active")} ({activeAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="past" data-testid="tab-past-alerts">
              {t("past")} ({pastAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="high-risk" data-testid="tab-high-risk-alerts">
              {t("highRisk")} ({highRiskAlerts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filterAlerts(mockAlerts).map(alert => (
              <AlertCard key={alert.id} {...alert} />
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {filterAlerts(activeAlerts).map(alert => (
              <AlertCard key={alert.id} {...alert} />
            ))}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {filterAlerts(pastAlerts).map(alert => (
              <AlertCard key={alert.id} {...alert} />
            ))}
          </TabsContent>

          <TabsContent value="high-risk" className="space-y-4">
            {filterAlerts(highRiskAlerts).map(alert => (
              <AlertCard key={alert.id} {...alert} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
