# Finance Resilience Advisor - System Architecture & API Reference

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                              │
│  ┌──────────────┬──────────────┬──────────────┬────────────────┐ │
│  │  Dashboard   │  Wallet Mgmt │  Insurance   │  EMI Manager   │ │
│  └──────┬───────┴──────┬───────┴──────┬──────┴────────┬────────┘ │
│         │              │              │               │            │
│         └──────────────┴──────────────┴───────────────┘            │
│                           │                                         │
│                    REST API + WebSocket                             │
│                           │                                         │
└─────────────────────────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVER LAYER                                │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    API Gateway (Express)                    │ │
│  │  • Route handling                                           │ │
│  │  • Request validation                                       │ │
│  │  • WebSocket management                                     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           ▼                                        │
│  ┌──────────────┬──────────────┬──────────────┬────────────────┐ │
│  │  AI Service  │ Weather Svc  │ Risk Engine  │ Storage Mgmt   │ │
│  │              │              │              │                │ │
│  │ • ChatBot    │ • OpenWeather│ • Prediction │ • Users        │ │
│  │ • Intent     │ • Data fetch │ • Factors    │ • Wallets      │ │
│  │   Analysis   │ • Caching    │ • XAI Exp.   │ • Transactions │ │
│  │              │              │              │ • EMI          │ │
│  │              │              │              │ • Insurance    │ │
│  └──────────────┴──────────────┴──────────────┴────────────────┘ │
│                                                                    │
└─────────────────────────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                   │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            In-Memory Storage (Current)                   │   │
│  │  • User Data                                             │   │
│  │  • Wallet Accounts & Transactions                        │   │
│  │  • EMI Details                                           │   │
│  │  • Insurance Policies                                    │   │
│  │  • Action Logs                                           │   │
│  │  • Weather Data                                          │   │
│  │  • Risk Predictions                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                    │
│  Production: Can be replaced with PostgreSQL/MongoDB             │
│                                                                    │
└─────────────────────────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                               │
│                                                                    │
│  ┌──────────────┬──────────────┬──────────────┐                 │
│  │ OpenAI API   │ Gemini API   │ OpenWeather  │                 │
│  │ (ChatGPT)    │ (Google)     │   API        │                 │
│  └──────────────┴──────────────┴──────────────┘                 │
│                                                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📡 API Reference

### 1. Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```
*(Built with existing auth system)*

### 2. Wallet Management Endpoints

#### Get User Accounts
```
GET /api/wallet/:userId
Response: WalletAccount[]
```

#### Create Account
```
POST /api/wallet
Body: {
  "userId": "string",
  "accountType": "wallet" | "emergency_savings",
  "balance": number,
  "currency": "string"
}
Response: WalletAccount
```

#### Deposit Funds
```
POST /api/wallet/:accountId/deposit
Body: { "amount": number }
Response: WalletAccount (updated)
```

#### Withdraw Funds
```
POST /api/wallet/:accountId/withdraw
Body: { "amount": number }
Response: WalletAccount (updated)
Status: 400 if insufficient balance
```

### 3. Transaction Endpoints

#### Get User Transactions
```
GET /api/transactions/:userId
Response: Transaction[]
```

#### Create Transaction
```
POST /api/transactions
Body: {
  "userId": "string",
  "fromAccountId": "string",
  "toAccountId": "string" (optional),
  "amount": number,
  "transactionType": "deposit" | "withdrawal" | "transfer" | "auto_transfer",
  "status": "pending" | "completed" | "failed",
  "riskLevel": "high" | "medium" | "low" | "safe" (optional),
  "reason": "string" (optional)
}
Response: Transaction
```

#### Auto-Transfer (High-Risk)
```
POST /api/transactions/auto-transfer
Body: {
  "userId": "string",
  "fromAccountId": "string",
  "toAccountId": "string",
  "amount": number,
  "riskLevel": "high" | "medium" | "low" | "safe"
}
Response: Transaction
Broadcast: { type: "auto_transfer", transaction, fromAccount, toAccount }
```

### 4. EMI Endpoints

#### Get User EMIs
```
GET /api/emi/:userId
Response: EMI[]
```

#### Create EMI
```
POST /api/emi
Body: {
  "userId": "string",
  "loanAmount": number,
  "monthlyEMI": number,
  "dueDate": timestamp,
  "status": "active" | "paused" | "completed"
}
Response: EMI
```

#### Pause EMI
```
POST /api/emi/:emiId/pause
Body: { "pauseMonths": number (1-6) }
Response: EMI
Broadcast: { type: "emi_paused", emi, actionLog }
```

#### Resume EMI
```
POST /api/emi/:emiId/resume
Body: {}
Response: EMI
Broadcast: { type: "emi_resumed", emi, actionLog }
```

### 5. Insurance Endpoints

#### Get User Insurance
```
GET /api/insurance/:userId
Response: Insurance[]
```

#### Create Insurance
```
POST /api/insurance
Body: {
  "userId": "string",
  "insuranceType": "micro" | "crop" | "property" | "personal",
  "coverageAmount": number,
  "status": "active" | "inactive" | "triggered",
  "riskCondition": "string" (optional)
}
Response: Insurance
```

#### Activate Insurance
```
POST /api/insurance/:insuranceId/activate
Body: {}
Response: Insurance
Broadcast: { type: "insurance_activated", insurance, actionLog }
```

### 6. Risk Prediction Endpoints

#### Get User Risk Prediction
```
GET /api/risk/:userId
Response: RiskPrediction
```

#### Get All Risk Predictions
```
GET /api/risk/all
Response: RiskPrediction[]
```

#### Create Risk Prediction
```
POST /api/risk
Body: {
  "userId": "string",
  "location": "string",
  "riskLevel": "high" | "medium" | "low" | "safe",
  "score": number (0-100),
  "factors": {
    "windImpact": number,
    "rainfallImpact": number,
    "humidityImpact": number,
    "temperatureImpact": number
  }
}
Response: RiskPrediction
Broadcast: { type: "risk_prediction", prediction }
```

### 7. Weather Endpoints

#### Get Weather by Location
```
GET /api/weather/location/:location
Response: WeatherData[]
```

#### Create Weather Data
```
POST /api/weather
Body: {
  "location": "string",
  "temperature": number,
  "humidity": number,
  "windSpeed": number,
  "rainfall": number,
  "weatherCondition": "string"
}
Response: WeatherData
Broadcast: { type: "weather_update", weatherData }
```

### 8. AI Chatbot Endpoints

#### Get Chat History
```
GET /api/chat/:userId
Response: ChatMessage[]
```

#### Create Chat Message
```
POST /api/chat
Body: {
  "userId": "string",
  "role": "user" | "assistant",
  "content": "string",
  "language": "string"
}
Response: ChatMessage
Broadcast: { type: "chat_message", message }
```

#### AI Chat Response
```
POST /api/ai-chat
Body: {
  "userId": "string",
  "message": "string",
  "language": "en" | "hi"
}
Response: {
  "userMessage": ChatMessage,
  "assistantMessage": ChatMessage
}
Broadcast: { type: "chat_response", userMessage, assistantMessage }
Status: 500 if AI service unavailable (uses fallback)
```

### 9. Action Log Endpoints

#### Get All Action Logs
```
GET /api/action-logs
Response: ActionLog[]
```

#### Get User Action Logs
```
GET /api/action-logs/user/:userId
Response: ActionLog[]
```

#### Create Action Log
```
POST /api/action-logs
Body: {
  "userId": "string",
  "userName": "string",
  "location": "string",
  "actionType": "insurance" | "fund_transfer" | "emi_pause" | "alert_sent",
  "status": "triggered" | "completed" | "failed",
  "riskLevel": "high" | "medium" | "low" | "safe",
  "details": "string"
}
Response: ActionLog
Broadcast: { type: "new_action", log }
```

---

## 🔄 Data Flow Examples

### Scenario 1: High-Risk Weather Detection

```
1. Weather Service fetches data from OpenWeather API
   OpenWeather API → weatherService.fetchWeatherByLocation()
   
2. Risk Prediction Service calculates risk
   Weather Data → riskPredictionService.calculateRiskLevel()
   Output: RiskPrediction with score=78, level="high"
   
3. Risk Prediction stored and broadcast
   POST /api/risk → Broadcast: { type: "risk_prediction", ... }
   
4. System triggers automatic actions
   a) Create Action Log
      POST /api/action-logs → { actionType: "alert_sent" }
      
   b) Auto-transfer funds
      POST /api/transactions/auto-transfer
      → Wallet → Emergency Savings (automatic)
      
   c) Offer Insurance
      POST /api/insurance/:id/activate (if user has policy)
      
   d) Suggest EMI Pause
      User can POST /api/emi/:id/pause
      
5. Admin Dashboard receives real-time updates
   WebSocket Broadcast → All connected clients updated
```

### Scenario 2: User Asks Chatbot Question

```
1. User enters message in Chatbot UI
   "How do I protect my family?"
   
2. Message sent to AI Chat endpoint
   POST /api/ai-chat
   {
     "userId": "user-1",
     "message": "How do I protect my family?",
     "language": "en"
   }
   
3. Server processes request
   a) Save user message
      POST /api/chat (user role)
      
   b) Get chat history for context
      GET /api/chat/user-1
      
   c) Call AI Service
      aiChatbotService.getChatResponse()
      → If OpenAI available: Use ChatGPT
      → If Gemini available: Use Gemini
      → Fallback: Use rule-based response
      
   d) Save AI response
      POST /api/chat (assistant role)
      
4. Response sent to client
   {
     "userMessage": { ... },
     "assistantMessage": { ... }
   }
   
5. WebSocket broadcast
   Broadcast: { type: "chat_response", ... }
```

### Scenario 3: User Pauses EMI During Emergency

```
1. User clicks Pause EMI button
   Form: pauseMonths = 3
   
2. Server receives request
   POST /api/emi/:emiId/pause
   { "pauseMonths": 3 }
   
3. Server processing
   a) Verify EMI exists
   b) Update EMI status to "paused"
   c) Calculate pauseUntil = now + (3 * 30 days)
   d) Create Action Log
      {
        "actionType": "emi_pause",
        "status": "completed",
        "riskLevel": "high"
      }
   
4. Responses
   a) Return updated EMI
   b) Broadcast WebSocket event
      { type: "emi_paused", emi, actionLog }
   
5. UI Updates
   a) EMI status shows "PAUSED"
   b) Next payment date updates
   c) Notification shown to user
```

---

## 🔌 WebSocket Events

### Broadcast Events
```typescript
type BroadcastEvent = 
  | { type: "connected"; message: string }
  | { type: "new_action"; log: ActionLog }
  | { type: "auto_transfer"; transaction: Transaction; fromAccount: WalletAccount; toAccount: WalletAccount }
  | { type: "emi_paused"; emi: EMI; actionLog: ActionLog }
  | { type: "emi_resumed"; emi: EMI; actionLog: ActionLog }
  | { type: "insurance_activated"; insurance: Insurance; actionLog: ActionLog }
  | { type: "risk_prediction"; prediction: RiskPrediction }
  | { type: "weather_update"; weatherData: WeatherData }
  | { type: "chat_message"; message: ChatMessage }
  | { type: "chat_response"; userMessage: ChatMessage; assistantMessage: ChatMessage }
```

### Connection Example
```javascript
// Client
const ws = new WebSocket('ws://localhost:5000/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'connected':
      console.log('Connected to real-time updates');
      break;
    case 'auto_transfer':
      console.log('Funds transferred:', data.transaction.amount);
      break;
    case 'risk_prediction':
      console.log('Risk updated:', data.prediction.riskLevel);
      break;
    // ... handle other events
  }
};
```

---

## 🛡️ Error Handling

### Standard Error Responses
```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (invalid data)
- **404**: Not Found (resource doesn't exist)
- **500**: Server Error
- **503**: Service Unavailable (AI service down, fallback used)

### Validation Errors
```json
{
  "error": "Invalid action log data"
}
```

---

## 📊 Database Models

All models use TypeScript interfaces (defined in `shared/schema.ts`):

1. **User** - User account information
2. **WalletAccount** - Wallet and emergency savings accounts
3. **Transaction** - All financial transactions
4. **EMI** - Loan EMI details
5. **Insurance** - Insurance policies
6. **ActionLog** - System action history
7. **WeatherData** - Weather observations
8. **RiskPrediction** - Risk assessment results
9. **ChatMessage** - Chatbot conversation history

---

## 🔐 Security Considerations

1. **Input Validation**: All inputs validated with Zod schemas
2. **Type Safety**: Full TypeScript type checking
3. **Error Handling**: Graceful error handling with fallbacks
4. **API Keys**: Stored in environment variables
5. **WebSocket**: Broadcasting doesn't leak sensitive data
6. **Authentication**: Integrated with existing auth system

---

## 🚀 Scalability Notes

### Current: In-Memory Storage
- Good for: Development, testing, demos
- Limitation: Data lost on restart
- Max users: ~1000 concurrent

### Production: PostgreSQL/MongoDB
- Recommended setup
- Persistent storage
- Higher scalability
- Better query performance

### Horizontal Scaling
- Use Redis for WebSocket message queue
- Implement database clustering
- Use CDN for static assets
- Load balance API servers

---

## 📈 Future API Enhancements

### Phase 2
- Batch transaction API
- Webhook notifications
- Advanced analytics API
- Machine learning model endpoints
- Multi-currency support

### Phase 3
- GraphQL API
- Mobile-optimized endpoints
- Real-time streaming API
- Third-party integrations
- OAuth2 authentication

---

**Version**: 1.0  
**Last Updated**: March 17, 2026  
**Architecture Review**: Complete
