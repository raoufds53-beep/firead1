import { Bell, MapPin, Moon, Sun, Shield, LogOut, User, ChevronDown, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./ThemeProvider";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import LanguageSelector from "./LanguageSelector";
import { Link, useLocation } from "wouter";

interface HeaderProps {
  userLocation?: string;
  notificationCount?: number;
}

export default function Header({ userLocation = "Mumbai, Maharashtra", notificationCount = 3 }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FiReAd</span>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/">
                <Button variant={location === "/" ? "secondary" : "ghost"} data-testid="link-home">
                  {t("home")}
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant={location === "/dashboard" ? "secondary" : "ghost"} data-testid="link-dashboard">
                  {t("dashboard")}
                </Button>
              </Link>
              <Link href="/alerts">
                <Button variant={location === "/alerts" ? "secondary" : "ghost"} data-testid="link-alerts">
                  {t("alerts")}
                </Button>
              </Link>
              {user.role === "admin" && (
                <>
                  <Link href="/admin">
                    <Button variant={location === "/admin" ? "secondary" : "ghost"} data-testid="link-admin">
                      {t("admin")}
                    </Button>
                  </Link>
                  <Link href="/action-log">
                    <Button variant={location === "/action-log" ? "secondary" : "ghost"} data-testid="link-action-log">
                      Action Log
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span data-testid="text-location">{userLocation}</span>
              </div>
            )}

            {user && (
              <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    variant="destructive"
                    data-testid="badge-notification-count"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            )}

            <LanguageSelector />

            <Button variant="ghost" size="icon" onClick={toggleTheme} data-testid="button-theme-toggle">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2" data-testid="button-user-menu">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm max-w-24 truncate">{user.email}</span>
                    <Badge variant="outline" className="hidden sm:inline-flex text-xs">
                      {user.role}
                    </Badge>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem onClick={() => navigate("/action-log")}>
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Action Log
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout().then(() => navigate("/login"))}
                    className="text-destructive"
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button size="sm" data-testid="button-login">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
