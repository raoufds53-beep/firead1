import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "./LanguageProvider";

export type RiskLevel = "high" | "medium" | "low" | "safe";

interface RiskLevelBadgeProps {
  level: RiskLevel;
  className?: string;
}

const riskConfig = {
  high: {
    labelKey: "highRiskLabel",
    className: "bg-risk-high text-white border-transparent",
  },
  medium: {
    labelKey: "mediumRiskLabel",
    className: "bg-risk-medium text-white border-transparent",
  },
  low: {
    labelKey: "lowRiskLabel",
    className: "bg-risk-low text-foreground border-transparent",
  },
  safe: {
    labelKey: "safeLabel",
    className: "bg-risk-safe text-white border-transparent",
  },
};

export default function RiskLevelBadge({ level, className }: RiskLevelBadgeProps) {
  const { t } = useLanguage();
  const config = riskConfig[level];
  
  return (
    <Badge 
      className={cn(config.className, className)}
      data-testid={`badge-risk-${level}`}
    >
      {t(config.labelKey)}
    </Badge>
  );
}
