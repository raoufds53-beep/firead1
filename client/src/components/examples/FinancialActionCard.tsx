import FinancialActionCard from "../FinancialActionCard";

export default function FinancialActionCardExample() {
  return (
    <div className="p-4 grid gap-4 max-w-2xl">
      <FinancialActionCard
        id="action-1"
        type="insurance"
        title="Activate Micro-Insurance"
        description="Protect your crops with weather-based insurance coverage"
        status="recommended"
        beforeAmount="₹0 Protected"
        afterAmount="₹50,000 Protected"
        onActivate={() => console.log("Insurance activated")}
      />
      <FinancialActionCard
        id="action-2"
        type="fund_protection"
        title="Transfer to Safe Account"
        description="Move funds to flood-protected savings account"
        status="triggered"
        beforeAmount="₹25,000"
        afterAmount="₹25,000 (Protected)"
      />
      <FinancialActionCard
        id="action-3"
        type="emi_pause"
        title="Pause Loan EMI"
        description="Temporarily freeze loan payments during crisis"
        status="completed"
      />
    </div>
  );
}
