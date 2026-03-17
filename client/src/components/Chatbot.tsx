import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  GREETING,
  NO_MATCH,
  QUICK_REPLIES,
  getBotResponse,
  type ChatLang,
} from "@/lib/chatbot-rules";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

function renderText(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    );
  });
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<ChatLang>("en");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "greeting", role: "bot", text: GREETING["en"], timestamp: new Date() },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (role: "user" | "bot", text: string) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), role, text, timestamp: new Date() },
    ]);
  };

  const handleSend = (text?: string) => {
    const userText = text ?? input.trim();
    if (!userText) return;
    setInput("");

    addMessage("user", userText);

    const lowerText = userText.toLowerCase();
    const isLangSwitch =
      lowerText.includes("hindi") || lowerText.includes("हिंदी") ||
      lowerText.includes("english") || lowerText.includes("switch") ||
      lowerText.includes("बदलें");

    setTimeout(() => {
      if (isLangSwitch) {
        const newLang: ChatLang = lang === "en" ? "hi" : "en";
        setLang(newLang);
        addMessage("bot", getBotResponse(userText, newLang));
      } else {
        addMessage("bot", getBotResponse(userText, lang));
      }
    }, 400);
  };

  const handleLangToggle = () => {
    const newLang: ChatLang = lang === "en" ? "hi" : "en";
    setLang(newLang);
    setMessages([{ id: "greeting", role: "bot", text: GREETING[newLang], timestamp: new Date() }]);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsOpen(prev => !prev)}
          data-testid="button-chatbot-toggle"
          aria-label="Open chat assistant"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-xl border bg-background shadow-xl flex flex-col transition-all duration-300",
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        )}
        style={{ height: "520px" }}
      >
        <div className="flex items-center justify-between p-3 border-b rounded-t-xl bg-primary text-primary-foreground">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <div>
              <p className="font-semibold text-sm">FiReAd Assistant</p>
              <p className="text-xs opacity-80">AI Financial Guide</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleLangToggle}
              data-testid="button-chatbot-lang"
            >
              <Languages className="h-3.5 w-3.5" />
              <span className="text-xs">{lang === "en" ? "हिंदी" : "EN"}</span>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                msg.role === "bot" ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                {msg.role === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className={cn(
                "rounded-xl px-3 py-2 text-sm max-w-[80%]",
                msg.role === "bot" ? "bg-muted" : "bg-primary text-primary-foreground"
              )}>
                {renderText(msg.text)}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-2 border-t space-y-2">
          <div className="flex flex-wrap gap-1">
            {QUICK_REPLIES[lang].slice(0, 3).map((reply, i) => (
              <Badge
                key={i}
                variant="outline"
                className="cursor-pointer text-xs hover-elevate"
                onClick={() => handleSend(reply)}
                data-testid={`button-quick-reply-${i}`}
              >
                {reply}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder={lang === "en" ? "Type your question..." : "अपना प्रश्न लिखें..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              className="text-sm"
              data-testid="input-chatbot-message"
            />
            <Button size="icon" onClick={() => handleSend()} data-testid="button-chatbot-send">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
