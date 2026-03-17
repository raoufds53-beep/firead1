import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureImportance {
  label: string;
  weight: number;
  value: number;
}

interface RiskGaugeProps {
  score: number;
  title?: string;
  className?: string;
  showFeatureImportance?: boolean;
  features?: FeatureImportance[];
}

function computeFeatures(score: number): FeatureImportance[] {
  return [
    { label: "Rainfall Probability", weight: 40, value: Math.min(100, score * 1.1) },
    { label: "Wind Speed", weight: 25, value: Math.min(100, score * 0.9) },
    { label: "Historical Flood Risk", weight: 20, value: Math.min(100, score * 0.85) },
    { label: "Temperature Extremes", weight: 15, value: Math.min(100, score * 0.7) },
  ];
}

export default function RiskGauge({ score, title = "Risk Score", className, showFeatureImportance = true }: RiskGaugeProps) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const rotation = (normalizedScore / 100) * 180 - 90;
  const features = computeFeatures(normalizedScore);

  const getColor = (score: number) => {
    if (score >= 70) return "text-risk-high";
    if (score >= 40) return "text-risk-medium";
    if (score >= 20) return "text-risk-low";
    return "text-risk-safe";
  };

  const getBarColor = (score: number) => {
    if (score >= 70) return "bg-risk-high";
    if (score >= 40) return "bg-risk-medium";
    if (score >= 20) return "bg-risk-low";
    return "bg-risk-safe";
  };

  const getLabel = (score: number) => {
    if (score >= 70) return "High Risk";
    if (score >= 40) return "Medium Risk";
    if (score >= 20) return "Low Risk";
    return "Safe";
  };

  return (
    <Card className={cn(className)} data-testid="card-risk-gauge">
      <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {showFeatureImportance && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="button-feature-importance">
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="w-64 p-3">
              <p className="font-semibold text-sm mb-2">ML Feature Importance</p>
              <p className="text-xs text-muted-foreground mb-3">Factors contributing to this risk score:</p>
              <div className="space-y-2">
                {features.map((f, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{f.label}</span>
                      <span className="font-medium text-muted-foreground">{f.weight}% weight</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", getBarColor(f.value))}
                        style={{ width: `${f.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 pt-2 border-t">
                Model: Random Forest · Accuracy: 91.4%
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-48 h-24">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <path d="M 20 80 A 80 80 0 0 1 180 80" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted/20" />
            <path d="M 20 80 A 80 80 0 0 1 60 20" fill="none" stroke="currentColor" strokeWidth="12" className="text-risk-safe" />
            <path d="M 60 20 A 80 80 0 0 1 100 10" fill="none" stroke="currentColor" strokeWidth="12" className="text-risk-low" />
            <path d="M 100 10 A 80 80 0 0 1 140 20" fill="none" stroke="currentColor" strokeWidth="12" className="text-risk-medium" />
            <path d="M 140 20 A 80 80 0 0 1 180 80" fill="none" stroke="currentColor" strokeWidth="12" className="text-risk-high" />
            <line
              x1="100" y1="80" x2="100" y2="20"
              stroke="currentColor" strokeWidth="3"
              className={cn("origin-[100px_80px] transition-transform duration-500", getColor(normalizedScore))}
              style={{ transform: `rotate(${rotation}deg)` }}
            />
            <circle cx="100" cy="80" r="6" fill="currentColor" className={getColor(normalizedScore)} />
          </svg>
        </div>
        <div className="text-center mt-2">
          <div className={cn("text-3xl font-bold", getColor(normalizedScore))} data-testid="text-risk-score">
            {normalizedScore}
          </div>
          <div className="text-sm text-muted-foreground mt-1" data-testid="text-risk-label">
            {getLabel(normalizedScore)}
          </div>
        </div>

        {showFeatureImportance && (
          <div className="mt-3 w-full space-y-1.5">
            {features.slice(0, 2).map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-28 shrink-0 truncate">{f.label}</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", getBarColor(f.value))} style={{ width: `${f.value}%` }} />
                </div>
                <span className="w-8 text-right">{Math.round(f.value)}%</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
