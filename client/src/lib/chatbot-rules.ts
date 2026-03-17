export type ChatLang = "en" | "hi";

export interface ChatRule {
  patterns: string[];
  response: Record<ChatLang, string>;
}

export const QUICK_REPLIES: Record<ChatLang, string[]> = {
  en: [
    "How does auto-protection work?",
    "What is my risk level?",
    "How to register?",
    "What is micro-insurance?",
    "How to transfer funds?",
    "Emergency contact",
    "Switch to Hindi",
  ],
  hi: [
    "स्वतः-सुरक्षा कैसे काम करती है?",
    "मेरा जोखिम स्तर क्या है?",
    "पंजीकरण कैसे करें?",
    "माइक्रो-बीमा क्या है?",
    "पैसे कैसे ट्रांसफर करें?",
    "आपातकालीन संपर्क",
    "English में बदलें",
  ],
};

export const CHAT_RULES: ChatRule[] = [
  {
    patterns: ["auto", "automatic", "protection", "work", "स्वतः", "सुरक्षा", "काम"],
    response: {
      en: "🤖 **Auto-Protection** works in 3 steps:\n1. Our system monitors weather data 24/7\n2. When high risk is detected, it instantly sends you an alert\n3. Financial safeguards (insurance, fund transfer, EMI pause) are automatically recommended — with one tap to activate.",
      hi: "🤖 **स्वतः-सुरक्षा** 3 चरणों में काम करती है:\n1. हमारा सिस्टम 24/7 मौसम डेटा मॉनिटर करता है\n2. उच्च जोखिम पाए जाने पर, तुरंत आपको अलर्ट भेजा जाता है\n3. वित्तीय सुरक्षा (बीमा, फंड ट्रांसफर, EMI पॉज) स्वचालित रूप से अनुशंसित होती है — एक क्लिक में सक्रिय करें।",
    },
  },
  {
    patterns: ["risk", "level", "score", "जोखिम", "स्तर", "स्कोर"],
    response: {
      en: "📊 **Risk Levels** are calculated using:\n• Rainfall probability (40% weight)\n• Wind speed (25% weight)\n• Temperature extremes (15% weight)\n• Historical flood data (20% weight)\n\n🟢 Safe (0–25) → 🟡 Low (26–50) → 🟠 Medium (51–75) → 🔴 High (76–100)",
      hi: "📊 **जोखिम स्तर** इन आधारों पर गणना किया जाता है:\n• वर्षा संभावना (40% वजन)\n• हवा की गति (25% वजन)\n• तापमान चरम (15% वजन)\n• ऐतिहासिक बाढ़ डेटा (20% वजन)\n\n🟢 सुरक्षित (0–25) → 🟡 कम (26–50) → 🟠 मध्यम (51–75) → 🔴 उच्च (76–100)",
    },
  },
  {
    patterns: ["register", "sign up", "account", "join", "पंजीकरण", "खाता", "साइन अप"],
    response: {
      en: "📝 **To Register on FiReAd:**\n1. Click **Get Protected Now** on the home page\n2. Enter your email and create a password\n3. Add your location and financial info (optional)\n4. Start monitoring your risk in real-time!",
      hi: "📝 **FiReAd पर पंजीकरण करने के लिए:**\n1. होम पेज पर **अभी सुरक्षा पाएं** पर क्लिक करें\n2. अपनी ईमेल दर्ज करें और पासवर्ड बनाएं\n3. अपना स्थान और वित्तीय जानकारी जोड़ें (वैकल्पिक)\n4. रीयल-टाइम में अपना जोखिम मॉनिटर करना शुरू करें!",
    },
  },
  {
    patterns: ["micro", "insurance", "बीमा", "माइक्रो"],
    response: {
      en: "🛡️ **Micro-Insurance** is a low-cost protection plan:\n• Covers flood, drought, and cyclone damage\n• Premiums as low as ₹50/month\n• Automatically activates when risk is High\n• Claim processed within 48 hours of disaster\n• No paperwork required for claims under ₹10,000",
      hi: "🛡️ **माइक्रो-बीमा** एक कम लागत की सुरक्षा योजना है:\n• बाढ़, सूखा और चक्रवात नुकसान को कवर करती है\n• ₹50/माह से कम प्रीमियम\n• जोखिम उच्च होने पर स्वचालित रूप से सक्रिय होती है\n• आपदा के 48 घंटे में क्लेम प्रोसेस होता है\n• ₹10,000 तक के क्लेम के लिए कोई कागजी कार्रवाई नहीं",
    },
  },
  {
    patterns: ["transfer", "fund", "safe account", "move", "ट्रांसफर", "फंड", "खाता", "पैसे"],
    response: {
      en: "💰 **Fund Transfer to Safe Account:**\n1. Go to **Dashboard → Financial Actions**\n2. Tap **Transfer to Safe Account**\n3. Your funds move to a flood-protected savings account\n4. Accessible anytime, even during disasters\n5. Zero transfer fees during emergency periods",
      hi: "💰 **सुरक्षित खाते में फंड ट्रांसफर:**\n1. **डैशबोर्ड → वित्तीय कार्रवाई** पर जाएं\n2. **सुरक्षित खाते में ट्रांसफर** पर टैप करें\n3. आपके फंड बाढ़-संरक्षित बचत खाते में चले जाते हैं\n4. आपदा के दौरान भी कभी भी एक्सेस योग्य\n5. आपातकाल में जीरो ट्रांसफर शुल्क",
    },
  },
  {
    patterns: ["emergency", "contact", "help", "support", "आपातकाल", "संपर्क", "सहायता"],
    response: {
      en: "🆘 **Emergency Contacts:**\n• FiReAd Helpline: **1800-FI-READ** (toll-free)\n• Email: help@firead.com\n• WhatsApp: +91-98765-43210\n• Disaster Helpline: **112**\n• Flood Relief: **1070**\n\nWe respond within 30 minutes during active alerts.",
      hi: "🆘 **आपातकालीन संपर्क:**\n• FiReAd हेल्पलाइन: **1800-FI-READ** (टोल-फ्री)\n• ईमेल: help@firead.com\n• WhatsApp: +91-98765-43210\n• आपदा हेल्पलाइन: **112**\n• बाढ़ राहत: **1070**\n\nसक्रिय अलर्ट के दौरान हम 30 मिनट के भीतर जवाब देते हैं।",
    },
  },
  {
    patterns: ["emi", "loan", "pause", "freeze", "ईएमआई", "ऋण", "लोन", "रोकें"],
    response: {
      en: "⏸️ **EMI Pause / Loan Freeze:**\n• Available during declared disaster periods\n• No penalty or interest during pause\n• Automatic 3-month pause when risk = High\n• Notify your bank through FiReAd dashboard\n• Resumes automatically after the risk period",
      hi: "⏸️ **EMI पॉज / लोन फ्रीज:**\n• घोषित आपदा अवधि के दौरान उपलब्ध\n• पॉज के दौरान कोई जुर्माना या ब्याज नहीं\n• जोखिम = उच्च होने पर स्वचालित 3 महीने पॉज\n• FiReAd डैशबोर्ड के माध्यम से अपने बैंक को सूचित करें\n• जोखिम अवधि के बाद स्वचालित रूप से फिर शुरू होता है",
    },
  },
  {
    patterns: ["hindi", "हिंदी", "switch", "language", "भाषा"],
    response: {
      en: "🌐 Use the **language selector** (globe icon) in the top navigation to switch between English and Hindi. The chatbot will also respond in your chosen language!",
      hi: "🌐 ऊपर नेविगेशन में **भाषा चयनकर्ता** (ग्लोब आइकन) का उपयोग करके English और Hindi के बीच स्विच करें। चैटबॉट भी आपकी चुनी हुई भाषा में जवाब देगा!",
    },
  },
];

export const GREETING: Record<ChatLang, string> = {
  en: "👋 Hello! I'm **FiReAd Assistant**. I can help you with climate risk protection and financial guidance.\n\nWhat would you like to know?",
  hi: "👋 नमस्ते! मैं **FiReAd सहायक** हूं। मैं जलवायु जोखिम सुरक्षा और वित्तीय मार्गदर्शन में आपकी सहायता कर सकता हूं।\n\nआप क्या जानना चाहते हैं?",
};

export const NO_MATCH: Record<ChatLang, string> = {
  en: "🤔 I didn't quite understand that. Try one of the quick replies below, or ask about:\n• Risk levels\n• Insurance\n• Fund transfer\n• EMI pause\n• Registration",
  hi: "🤔 मुझे यह समझ नहीं आया। नीचे दिए गए त्वरित उत्तरों में से एक चुनें, या इनके बारे में पूछें:\n• जोखिम स्तर\n• बीमा\n• फंड ट्रांसफर\n• EMI पॉज\n• पंजीकरण",
};

export function getBotResponse(input: string, lang: ChatLang): string {
  const lower = input.toLowerCase();
  for (const rule of CHAT_RULES) {
    if (rule.patterns.some(p => lower.includes(p.toLowerCase()))) {
      return rule.response[lang];
    }
  }
  return NO_MATCH[lang];
}
