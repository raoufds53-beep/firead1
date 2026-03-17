import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CloudRain, Bell, TrendingUp, Users, MapPin, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/components/LanguageProvider";
import heroImage from "@assets/generated_images/Resilient_farming_family_protected_9f1d9d82.png";

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      icon: CloudRain,
      title: t("realTimeRiskDetection"),
      description: t("realTimeRiskDesc")
    },
    {
      icon: Bell,
      title: t("instantAlerts"),
      description: t("instantAlertsDesc")
    },
    {
      icon: Shield,
      title: t("automatedProtection"),
      description: t("automatedProtectionDesc")
    }
  ];

  const benefits = [
    {
      title: t("forFamilies"),
      points: [
        t("protectSavings"),
        t("activateInsurance"),
        t("localLanguageAlerts"),
        t("advanceWarnings")
      ]
    },
    {
      title: t("forBusinesses"),
      points: [
        t("pauseLoanEMIs"),
        t("protectInventory"),
        t("microFinanceProtection"),
        t("monitorRiskLocations")
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Resilient farming family" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              {t("heroTitle")}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login">
                <Button size="lg" data-testid="button-get-protected">
                  {t("getProtectedNow")}
                </Button>
              </Link>
              <Button variant="outline" size="lg" data-testid="button-learn-more">
                {t("learnMore")}
              </Button>
            </div>
            <div className="flex flex-wrap gap-8 pt-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span><strong>1,247</strong> {t("familiesProtected")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <span><strong>15,000+</strong> {t("alertsSent")}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span><strong>50+</strong> {t("regionsCovered")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("howItWorks")}</h2>
            <p className="text-muted-foreground">
              {t("howItWorksSubtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="text-center hover-elevate">
                  <CardHeader>
                    <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("builtForEveryone")}</h2>
            <p className="text-muted-foreground">
              {t("builtForEveryoneSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-2xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefit.points.map((point, pidx) => (
                      <li key={pidx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("readyToProtect")}</h2>
          <p className="text-xl mb-8 opacity-90">
            {t("readyToProtectSubtitle")}
          </p>
          <Link href="/login">
            <Button 
              size="lg" 
              variant="secondary"
              data-testid="button-get-started-cta"
            >
              {t("getStartedToday")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
