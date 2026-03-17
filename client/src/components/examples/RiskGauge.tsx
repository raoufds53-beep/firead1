import RiskGauge from "../RiskGauge";

export default function RiskGaugeExample() {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <RiskGauge score={15} title="Current Risk" />
      <RiskGauge score={75} title="Forecast Risk (48h)" />
    </div>
  );
}
