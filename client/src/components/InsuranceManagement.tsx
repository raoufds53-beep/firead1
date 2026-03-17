import { useState, useEffect } from "react";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/LanguageProvider";

interface Insurance {
  id: string;
  userId: string;
  insuranceType: "micro" | "crop" | "property" | "personal";
  coverageAmount: number;
  status: "active" | "inactive" | "triggered";
  activatedAt?: number;
  riskCondition?: string;
  createdAt: number;
}

const INSURANCE_TYPES = {
  micro: {
    name: "Micro Insurance",
    description: "Small protection for everyday financial risks",
    minCoverage: 10000,
    maxCoverage: 100000,
  },
  crop: {
    name: "Crop Protection",
    description: "Insurance for agricultural risks and weather damage",
    minCoverage: 25000,
    maxCoverage: 500000,
  },
  property: {
    name: "Property Insurance",
    description: "Protection against property damage and loss",
    minCoverage: 50000,
    maxCoverage: 1000000,
  },
  personal: {
    name: "Personal Insurance",
    description: "Health and wellbeing protection during emergencies",
    minCoverage: 10000,
    maxCoverage: 200000,
  },
};

export default function InsuranceManagement() {
  const { t } = useLanguage();
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskLevel, setRiskLevel] = useState<"high" | "medium" | "low" | "safe">("low");

  const userId = "user-1"; // Replace with actual user ID from auth

  useEffect(() => {
    fetchInsurances();
  }, []);

  const fetchInsurances = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/insurance/${userId}`);
      if (response.ok) {
        setInsurances(await response.json());
      }
    } catch (error) {
      console.error("Failed to fetch insurances:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInsurance = async (type: keyof typeof INSURANCE_TYPES) => {
    const coverage = INSURANCE_TYPES[type].maxCoverage;

    try {
      const response = await fetch("/api/insurance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          insuranceType: type,
          coverageAmount: coverage,
          status: "active",
          riskCondition: `Conditions met for ${INSURANCE_TYPES[type].name}`,
        }),
      });

      if (response.ok) {
        fetchInsurances();
      }
    } catch (error) {
      console.error("Failed to create insurance:", error);
    }
  };

  const handleActivateInsurance = async (insuranceId: string) => {
    try {
      const response = await fetch(`/api/insurance/${insuranceId}/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        fetchInsurances();
      }
    } catch (error) {
      console.error("Failed to activate insurance:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "triggered":
        return "bg-red-100 text-red-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "triggered":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading insurance data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Risk Alert Banner */}
      {riskLevel === "high" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">High Risk Alert!</p>
              <p className="text-sm text-red-800 mt-1">
                We recommend activating insurance coverage immediately. Your location is experiencing high-risk weather conditions.
              </p>
              <Button className="mt-2 bg-red-600 hover:bg-red-700" size="sm">
                View Recommendations
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Insurances */}
      {insurances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Active Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insurances.map(insurance => (
                <div key={insurance.id} className="p-4 border rounded-lg hover:bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(insurance.status)}
                        <h3 className="font-semibold">{INSURANCE_TYPES[insurance.insuranceType].name}</h3>
                        <Badge className={getStatusColor(insurance.status)}>
                          {insurance.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Coverage: ₹{insurance.coverageAmount.toLocaleString()}
                      </p>
                      {insurance.activatedAt && (
                        <p className="text-sm text-muted-foreground">
                          Activated: {new Date(insurance.activatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {insurance.status === "active" && (
                      <Button
                        onClick={() => handleActivateInsurance(insurance.id)}
                        variant="outline"
                        size="sm"
                      >
                        Trigger Coverage
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Insurance Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Plans</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Choose insurance plans to protect yourself against climate-related risks
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(INSURANCE_TYPES).map(([key, plan]) => {
              const existing = insurances.find(i => i.insuranceType === key);
              return (
                <div key={key} className="p-4 border rounded-lg hover:bg-muted/30">
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  <div className="mt-3 space-y-2">
                    <p className="text-sm">
                      Coverage Range: ₹{(plan.minCoverage / 1000).toFixed(0)}K - ₹{(plan.maxCoverage / 100000).toFixed(1)}L
                    </p>
                    {existing ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Already Enrolled</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleCreateInsurance(key as keyof typeof INSURANCE_TYPES)}
                        size="sm"
                        className="w-full"
                      >
                        Enroll Now
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Parametric Insurance Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-sm">1</div>
              <div>
                <p className="font-medium">Monitor Weather Conditions</p>
                <p className="text-sm text-muted-foreground">We continuously monitor weather data in your region</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-sm">2</div>
              <div>
                <p className="font-medium">Risk Detection</p>
                <p className="text-sm text-muted-foreground">When risk parameters are met, insurance automatically triggers</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-sm">3</div>
              <div>
                <p className="font-medium">Instant Payment</p>
                <p className="text-sm text-muted-foreground">Coverage amount is immediately transferred to your account</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-sm">4</div>
              <div>
                <p className="font-medium">Financial Protection</p>
                <p className="text-sm text-muted-foreground">Use funds for recovery without waiting for claim assessment</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
