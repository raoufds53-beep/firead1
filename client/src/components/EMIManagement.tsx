import { useState, useEffect } from "react";
import { Clock, PauseCircle, PlayCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/components/LanguageProvider";

interface EMI {
  id: string;
  userId: string;
  loanAmount: number;
  monthlyEMI: number;
  dueDate: number;
  status: "active" | "paused" | "completed";
  pausedUntil?: number;
  reason?: string;
  createdAt: number;
  updatedAt: number;
}

export default function EMIManagement() {
  const { t } = useLanguage();
  const [emis, setEmis] = useState<EMI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEMI, setSelectedEMI] = useState<EMI | null>(null);
  const [pauseMonths, setPauseMonths] = useState("3");

  const userId = "user-1"; // Replace with actual user ID from auth

  useEffect(() => {
    fetchEMIs();
  }, []);

  const fetchEMIs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/emi/${userId}`);
      if (response.ok) {
        setEmis(await response.json());
      }
    } catch (error) {
      console.error("Failed to fetch EMIs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseEMI = async (emiId: string) => {
    try {
      const response = await fetch(`/api/emi/${emiId}/pause`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pauseMonths: parseInt(pauseMonths) }),
      });

      if (response.ok) {
        setPauseMonths("3");
        setSelectedEMI(null);
        fetchEMIs();
      }
    } catch (error) {
      console.error("Failed to pause EMI:", error);
    }
  };

  const handleResumeEMI = async (emiId: string) => {
    try {
      const response = await fetch(`/api/emi/${emiId}/resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        fetchEMIs();
      }
    } catch (error) {
      console.error("Failed to resume EMI:", error);
    }
  };

  const calculateRemainingMonths = (loanAmount: number, monthlyEMI: number): number => {
    return Math.ceil(loanAmount / monthlyEMI);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading EMI data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* EMI Summary Cards */}
      {emis.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Loan Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{emis.reduce((sum, e) => sum + e.loanAmount, 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">{emis.length} active loans</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly EMI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{emis.reduce((sum, e) => sum + (e.status === "active" ? e.monthlyEMI : 0), 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Next payment due</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Paused EMIs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{emis.filter(e => e.status === "paused").length}</p>
              <p className="text-xs text-muted-foreground mt-1">Under pause status</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active EMIs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Your EMIs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {emis.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No EMIs found. Start with a loan to manage EMIs here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {emis.map(emi => (
                <div key={emi.id} className="p-4 border rounded-lg hover:bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Loan EMI</h3>
                        <Badge className={getStatusColor(emi.status)}>
                          {emi.status.charAt(0).toUpperCase() + emi.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                        <div>
                          <p className="text-muted-foreground">Loan Amount</p>
                          <p className="font-semibold">₹{emi.loanAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Monthly EMI</p>
                          <p className="font-semibold">₹{emi.monthlyEMI.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Remaining Months</p>
                          <p className="font-semibold">{calculateRemainingMonths(emi.loanAmount, emi.monthlyEMI)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-semibold text-sm">{formatDate(emi.dueDate)}</p>
                        </div>
                      </div>

                      {emi.status === "paused" && emi.pausedUntil && (
                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                          <p className="text-yellow-800">
                            EMI paused until {formatDate(emi.pausedUntil)}
                          </p>
                          {emi.reason && <p className="text-yellow-700 text-xs mt-1">Reason: {emi.reason}</p>}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {emi.status === "active" ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button onClick={() => setSelectedEMI(emi)} variant="outline" size="sm" className="gap-2">
                              <PauseCircle className="h-4 w-4" />
                              Pause
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Pause EMI</DialogTitle>
                              <DialogDescription>
                                Pause your loan payments for emergency relief. Choose the number of months to pause (typically 3-6 months).
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">
                                  During high-risk situations, EMI pause can be automatically triggered. You can manually request a pause anytime.
                                </p>
                              </div>

                              <div>
                                <label htmlFor="pause-months" className="text-sm font-medium">
                                  Pause Duration (months)
                                </label>
                                <select
                                  id="pause-months"
                                  value={pauseMonths}
                                  onChange={e => setPauseMonths(e.target.value)}
                                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                  {[1, 2, 3, 4, 5, 6].map(months => (
                                    <option key={months} value={months}>
                                      {months} month{months > 1 ? "s" : ""}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm font-medium">Impact Summary</p>
                                <p className="text-smtext-muted-foreground mt-1">
                                  Loan tenure will be extended by {pauseMonths} months. No interest charged during pause.
                                </p>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  onClick={() => emi && handlePauseEMI(emi.id)}
                                  className="flex-1"
                                >
                                  Confirm Pause
                                </Button>
                                <Button variant="outline" className="flex-1">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Button
                          onClick={() => handleResumeEMI(emi.id)}
                          variant="default"
                          size="sm"
                          className="gap-2"
                        >
                          <PlayCircle className="h-4 w-4" />
                          Resume
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* EMI Pause Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            EMI Pause Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-sm">When can I pause my EMI?</p>
              <p className="text-sm text-muted-foreground mt-1">
                You can pause EMI during high-risk weather situations, personal emergencies, or financial hardship. Banks typically allow 3-6 month pauses.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm">What happens when I pause?</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your monthly EMI payment is suspended for the selected period. Your loan tenure is extended automatically. No additional penalties are applied for verified emergencies.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm">Automatic Pause Feature</p>
              <p className="text-sm text-muted-foreground mt-1">
                During high-risk weather conditions in your area, your EMI can be automatically paused with bank approval. This is part of our financial protection system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
