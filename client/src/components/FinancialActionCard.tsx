import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Lock, PauseCircle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "./LanguageProvider";

type ActionType = "insurance" | "fund_protection" | "emi_pause";
type ActionStatus = "recommended" | "triggered" | "completed" | "cancelled";

interface FinancialActionCardProps {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  status: ActionStatus;
  beforeAmount?: string;
  afterAmount?: string;
  onActivate?: () => void;
  className?: string;
}

const actionIcons = {
  insurance: Shield,
  fund_protection: Lock,
  emi_pause: PauseCircle,
};

const statusConfig = {
  recommended: {
    labelKey: "recommended",
    variant: "secondary" as const,
    icon: Clock,
  },
  triggered: {
    labelKey: "triggered",
    variant: "default" as const,
    icon: Clock,
  },
  completed: {
    labelKey: "completed",
    variant: "outline" as const,
    icon: CheckCircle2,
  },
  cancelled: {
    labelKey: "cancelled",
    variant: "outline" as const,
    icon: XCircle,
  },
};

export default function FinancialActionCard({
  id,
  type,
  title,
  description,
  status,
  beforeAmount,
  afterAmount,
  onActivate,
  className,
}: FinancialActionCardProps) {
  const { t } = useLanguage();
  const Icon = actionIcons[type];
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card className={cn(className)} data-testid={`card-financial-action-${id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base" data-testid={`text-action-title-${id}`}>
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          </div>
        </div>
        <Badge variant={statusInfo.variant} className="gap-1">
          <StatusIcon className="h-3 w-3" />
          {t(statusInfo.labelKey)}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {beforeAmount && afterAmount && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{t("before")}</p>
              <p className="font-semibold">{beforeAmount}</p>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{t("after")}</p>
              <p className="font-semibold text-primary">{afterAmount}</p>
            </div>
          </div>
        )}

        {status === "recommended" && (
          <Button 
            className="w-full"
            onClick={() => {
              console.log(`Activating action ${id}`);
              onActivate?.();
            }}
            data-testid={`button-activate-${id}`}
          >
            {t("activateProtection")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
