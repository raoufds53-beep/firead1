import { useState } from "react";
import { Shield, Mail, Lock, AlertCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/AuthProvider";
import { useLocation } from "wouter";
import { useLanguage } from "@/components/LanguageProvider";
import { type Language } from "@/lib/translations";

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

function getErrorKey(code: string): string {
  if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") return "errorInvalidCredential";
  if (code === "auth/email-already-in-use") return "errorEmailInUse";
  if (code === "auth/weak-password") return "errorWeakPassword";
  if (code === "auth/invalid-email") return "errorInvalidEmail";
  return "errorGeneral";
}

export default function Login() {
  const { login, register } = useAuth();
  const [, navigate] = useLocation();
  const { t, language, setLanguage } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState<"login" | "register" | null>(null);

  const handleLogin = async (e: React.MouseEvent, role: "user" | "admin") => {
    e.preventDefault();
    if (!email || !password) {
      setError(t("errorInvalidEmail"));
      return;
    }
    setError("");
    setLoadingAction("login");
    const finalEmail = role === "admin" && !email.includes("@") ? `${email}@firead.com` : email;
    try {
      await login(finalEmail, password);
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (err: any) {
      setError(t(getErrorKey(err?.code || "")));
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRegister = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t("errorInvalidEmail"));
      return;
    }
    setError("");
    setLoadingAction("register");
    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(t(getErrorKey(err?.code || "")));
    } finally {
      setLoadingAction(null);
    }
  };

  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" data-testid="button-login-language">
                <Globe className="h-4 w-4" />
                {currentLang?.native}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGUAGES.map(lang => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? "bg-accent" : ""}
                  data-testid={`menu-item-login-lang-${lang.code}`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.native}</span>
                    <span className="text-xs text-muted-foreground">{lang.label}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">FiReAd</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">{t("welcomeBack")}</h1>
          <p className="text-muted-foreground mt-1">{t("financeResilienceAdvisor")}</p>
        </div>

        <Tabs defaultValue="user" onValueChange={() => { setEmail(""); setPassword(""); setError(""); }}>
          <TabsList className="w-full">
            <TabsTrigger value="user" className="flex-1" data-testid="tab-user-login">
              {t("userLogin")}
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex-1" data-testid="tab-admin-login">
              {t("adminLogin")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("userAccess")}</CardTitle>
                <CardDescription>{t("userAccessDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-user">{t("emailLabel")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email-user"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(""); }}
                      data-testid="input-email-user"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-user">{t("passwordLabel")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password-user"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(""); }}
                      onKeyDown={e => e.key === "Enter" && handleLogin(e as any, "user")}
                      data-testid="input-password-user"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3" data-testid="text-login-error">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    disabled={loadingAction !== null}
                    onClick={e => handleLogin(e, "user")}
                    data-testid="button-login-user"
                  >
                    {loadingAction === "login" ? t("signingIn") : t("signIn")}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={loadingAction !== null}
                    onClick={handleRegister}
                    data-testid="button-register"
                  >
                    {loadingAction === "register" ? t("creating") : t("register")}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">{t("demoUser")}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("adminAccess")}</CardTitle>
                <CardDescription>{t("adminAccessDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-admin">{t("emailLabel")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email-admin"
                      type="email"
                      placeholder="admin@firead.com"
                      className="pl-10"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(""); }}
                      data-testid="input-email-admin"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-admin">{t("passwordLabel")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password-admin"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(""); }}
                      onKeyDown={e => e.key === "Enter" && handleLogin(e as any, "admin")}
                      data-testid="input-password-admin"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3" data-testid="text-admin-login-error">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  className="w-full"
                  disabled={loadingAction !== null}
                  onClick={e => handleLogin(e, "admin")}
                  data-testid="button-login-admin"
                >
                  {loadingAction === "login" ? t("signingIn") : t("signIn")}
                </Button>

                <p className="text-xs text-muted-foreground text-center">{t("demoAdmin")}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
