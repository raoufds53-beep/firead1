import RiskLevelBadge from "../RiskLevelBadge";

export default function RiskLevelBadgeExample() {
  return (
    <div className="p-4 space-y-2">
      <RiskLevelBadge level="high" />
      <RiskLevelBadge level="medium" />
      <RiskLevelBadge level="low" />
      <RiskLevelBadge level="safe" />
    </div>
  );
}
