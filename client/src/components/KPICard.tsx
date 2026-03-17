import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export default function KPICard({ title, value, icon: Icon, trend, trendValue, className }: KPICardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  
  return (
    <Card className={cn(className)} data-testid={`card-kpi-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`text-kpi-value-${title.toLowerCase().replace(/\s+/g, "-")}`}>
          {value}
        </div>
        {trend && trendValue && (
          <div className={cn(
            "flex items-center gap-1 text-xs mt-1",
            trend === "up" ? "text-risk-safe" : trend === "down" ? "text-risk-high" : "text-muted-foreground"
          )}>
            <TrendIcon className="h-3 w-3" />
            <span>{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
