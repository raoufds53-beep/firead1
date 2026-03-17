import KPICard from "../KPICard";
import { Users, Shield, AlertTriangle, Clock } from "lucide-react";

export default function KPICardExample() {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard title="Total Users" value="1,247" icon={Users} trend="up" trendValue="+12% from last month" />
      <KPICard title="Active Alerts" value="23" icon={AlertTriangle} trend="down" trendValue="-5% from yesterday" />
      <KPICard title="Protected Families" value="892" icon={Shield} trend="up" trendValue="+18% this week" />
      <KPICard title="Avg Response Time" value="2.4m" icon={Clock} trend="neutral" trendValue="Same as last week" />
    </div>
  );
}
