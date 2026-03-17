import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import Chatbot from "@/components/Chatbot";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Alerts from "@/pages/Alerts";
import AdminDashboard from "@/pages/AdminDashboard";
import ActionLog from "@/pages/ActionLog";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType; adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user) return <Redirect to="/login" />;
  if (adminOnly && user.role !== "admin") return <Redirect to="/dashboard" />;
  return <Component />;
}

function Router() {
  const { user } = useAuth();
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login">
        {user ? <Redirect to="/dashboard" /> : <Login />}
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/alerts">
        <ProtectedRoute component={Alerts} />
      </Route>
      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} adminOnly />
      </Route>
      <Route path="/action-log">
        <ProtectedRoute component={ActionLog} adminOnly />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppShell() {
  const { user } = useAuth();
  const showShell = true;

  return (
    <div className="min-h-screen bg-background">
      {showShell && <Header />}
      <Toaster />
      <Router />
      {user && <Chatbot />}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <AppShell />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
