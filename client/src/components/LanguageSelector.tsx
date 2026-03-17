import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { type Language } from "@/lib/translations";

const languages = [
  { code: "en" as Language, label: "English", nativeLabel: "English" },
  { code: "hi" as Language, label: "Hindi", nativeLabel: "हिंदी" },
  { code: "mr" as Language, label: "Marathi", nativeLabel: "मराठी" },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" data-testid="button-language-selector">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage?.nativeLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-accent" : ""}
            data-testid={`menu-item-language-${lang.code}`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{lang.nativeLabel}</span>
              <span className="text-xs text-muted-foreground">{lang.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
