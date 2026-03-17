import AlertCard from "../AlertCard";

export default function AlertCardExample() {
  return (
    <div className="p-4 max-w-lg">
      <AlertCard
        id="alert-1"
        riskLevel="high"
        location="Mumbai, Maharashtra"
        timestamp="2 hours ago"
        weatherCondition="Heavy rainfall expected in 48 hours"
        temperature="28°C"
        rainfall="150mm"
        windSpeed="45 km/h"
        recommendations={[
          "Move savings to safe account",
          "Activate crop protection fund",
          "Secure loose items around property",
          "Stock up on essential supplies"
        ]}
        onTakeAction={() => console.log("Action taken")}
      />
    </div>
  );
}
