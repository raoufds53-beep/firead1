import { useState, useEffect } from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/LanguageProvider";

interface WalletAccount {
  id: string;
  userId: string;
  accountType: "wallet" | "emergency_savings";
  balance: number;
  currency: string;
  createdAt: number;
  updatedAt: number;
}

interface Transaction {
  id: string;
  userId: string;
  fromAccountId: string;
  toAccountId?: string;
  amount: number;
  transactionType: "deposit" | "withdrawal" | "transfer" | "auto_transfer";
  status: "pending" | "completed" | "failed";
  riskLevel?: "high" | "medium" | "low" | "safe";
  reason?: string;
  timestamp: number;
}

export default function WalletManagement() {
  const { t } = useLanguage();
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"accounts" | "transactions">("accounts");

  const userId = "user-1"; // Replace with actual user ID from auth

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [accountsRes, transactionsRes] = await Promise.all([
        fetch(`/api/wallet/${userId}`),
        fetch(`/api/transactions/${userId}`),
      ]);

      if (accountsRes.ok) {
        setAccounts(await accountsRes.json());
      }
      if (transactionsRes.ok) {
        setTransactions(await transactionsRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (accountId: string) => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const response = await fetch(`/api/wallet/${accountId}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(depositAmount) }),
      });

      if (response.ok) {
        setDepositAmount("");
        fetchWalletData();
      }
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  const handleWithdraw = async (accountId: string) => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const response = await fetch(`/api/wallet/${accountId}/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(withdrawAmount) }),
      });

      if (response.ok) {
        setWithdrawAmount("");
        fetchWalletData();
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
    }
  };

  const walletAccount = accounts.find(a => a.accountType === "wallet");
  const savingsAccount = accounts.find(a => a.accountType === "emergency_savings");

  const getTransactionIcon = (type: string) => {
    return type.includes("deposit") || type === "transfer" ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading wallet data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Account Balance Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {walletAccount && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-3xl font-bold">₹{walletAccount.balance.toLocaleString()}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Add Funds</label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                      min="0"
                    />
                    <Button onClick={() => handleDeposit(walletAccount.id)}>Deposit</Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Withdraw Funds</label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      min="0"
                      max={walletAccount.balance}
                    />
                    <Button variant="outline" onClick={() => handleWithdraw(walletAccount.id)}>
                      Withdraw
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {savingsAccount && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Emergency Savings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Protected Balance</p>
                <p className="text-3xl font-bold text-green-600">₹{savingsAccount.balance.toLocaleString()}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 This account is automatically funded during high-risk situations to ensure your financial safety.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-muted-foreground">Total Protected</p>
                  <p className="font-bold">₹{(walletAccount?.balance || 0) + savingsAccount.balance}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-xs">
                    {new Date(savingsAccount.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 10).map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3 flex-1">
                    {getTransactionIcon(transaction.transactionType)}
                    <div className="flex-1">
                      <p className="font-medium capitalize">{transaction.transactionType.replace("_", " ")}</p>
                      <p className="text-sm text-muted-foreground">{transaction.reason || "No reason specified"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.transactionType.includes("deposit") || transaction.transactionType === "transfer" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.transactionType === "withdrawal" || (transaction.transactionType === "transfer" && transaction.fromAccountId === walletAccount?.id) ? "-" : "+"}₹{transaction.amount}
                    </p>
                    <div className="flex gap-2 items-center justify-end">
                      <Badge className={getStatusBadgeColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
