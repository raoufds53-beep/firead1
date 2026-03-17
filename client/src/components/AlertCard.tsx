import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Cloud, Wind, Droplets, Clock, ChevronDown } from "lucide-react";
import RiskLevelBadge, { type RiskLevel } from "./RiskLevelBadge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLanguage } from "./LanguageProvider";

interface AlertCardProps {
  id: string;
  riskLevel: RiskLevel;
  location: string;
  timestamp: string;
  weatherCondition: string;
  temperature?: string;
  rainfall?: string;
  windSpeed?: string;
  recommendations?: string[];
  onTakeAction?: () => void;
}

export default function AlertCard({
  id,
  riskLevel,
  location,
  timestamp,
  weatherCondition,
  temperature,
  rainfall,
  windSpeed,
  recommendations = [],
  onTakeAction,
}: AlertCardProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  const borderColor = {
    high: "border-l-risk-high",
    medium: "border-l-risk-medium",
    low: "border-l-risk-low",
    safe: "border-l-risk-safe",
  }[riskLevel];

  return (
    <Card className={cn("border-l-4", borderColor)} data-testid={`card-alert-${id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <RiskLevelBadge level={riskLevel} />
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span data-testid={`text-alert-location-${id}`}>{location}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span data-testid={`text-alert-timestamp-${id}`}>{timestamp}</span>
          </div>
        </div>
        <Cloud className="h-5 w-5 text-muted-foreground" />
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="font-medium" data-testid={`text-alert-condition-${id}`}>{weatherCondition}</p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            {temperature && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Temp:</span>
                <span>{temperature}</span>
              </div>
            )}
            {rainfall && (
              <div className="flex items-center gap-1 text-primary">
                <Droplets className="h-4 w-4" />
                <span>{rainfall}</span>
              </div>
            )}
            {windSpeed && (
              <div className="flex items-center gap-1">
                <Wind className="h-4 w-4" />
                <span>{windSpeed}</span>
              </div>
            )}
          </div>
        </div>

        {recommendations.length > 0 && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-between"
                data-testid={`button-toggle-recommendations-${id}`}
              >
                <span>{t("recommendedActions")}</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-2">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  <span>{rec}</span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            data-testid={`button-view-details-${id}`}
            onClick={() => console.log(`Viewing details for alert ${id}`)}
          >
            {t("viewDetails")}
          </Button>
          <Button 
            variant={riskLevel === "high" ? "destructive" : "default"}
            size="sm"
            data-testid={`button-take-action-${id}`}
            onClick={() => {
              console.log(`Taking action for alert ${id}`);
              onTakeAction?.();
            }}
          >
            {t("takeAction")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
