# Finance Resilience Advisor - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Git

### 1. Installation

```bash
# Clone the repository (if not already done)
cd c:\firead\firead1

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# AI Services
OPENAI_API_KEY=sk-your-openai-key-here
GEMINI_API_KEY=your-gemini-key-here
AI_PROVIDER=openai

# Weather API
OPENWEATHER_API_KEY=your-openweather-api-key

# Server Config
NODE_ENV=development
PORT=5000
```

**How to Get API Keys:**

1. **OpenAI API Key**:
   - Visit https://platform.openai.com/api-keys
   - Create a new API key
   - Copy and paste in `.env.local`

2. **Google Gemini API Key**:
   - Visit https://ai.google.dev/
   - Create a new API key
   - Copy and paste in `.env.local`

3. **OpenWeather API Key**:
   - Visit https://openweathermap.org/api
   - Sign up and get free API key
   - Copy and paste in `.env.local`

### 3. Running the Application

#### Development Mode
```bash
# Start development server with hot reload
npm run dev

# The application will be available at http://localhost:5173
# API server runs on http://localhost:5000
```

#### Building for Production
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### 4. Verification Checklist

After starting the application, verify all features:

#### ✅ Chatbot
- Open the application
- Look for chat icon (bottom-right)
- Click to open chatbot
- Test with: "How do I protect my savings?"
- Should get an AI-powered response

#### ✅ Wallet Management
- Go to Dashboard → Wallet Tab
- View wallet and savings accounts
- Try deposit function (enter amount)
- Check transaction history

#### ✅ Insurance Management
- Go to Dashboard → Insurance Tab
- View available insurance plans
- Try enrolling in a plan
- Check active coverage

#### ✅ EMI Management
- Go to Dashboard → EMI Tab
- View loan details
- Try pause function for 3 months
- Check loan summary

#### ✅ Real-Time Updates
- Open DevTools (F12)
- Go to Network tab → WS
- Should see WebSocket connection to /ws
- Confirms real-time updates active

#### ✅ Admin Dashboard
- Go to /admin
- Should see risk zones table
- Should see recent financial actions
- Should display real-time metrics

---

## 📊 Mock Data for Testing

The application includes mock data for testing:

### Test Users
- Admin: Available in authentication system
- Regular User: Default "user-1" used in UI

### Mock Action Logs
- 20 sample actions with different types
- Various risk levels and statuses
- Timestamped entries for timeline testing

### Sample Weather Data
The system can generate mock weather for any location using:
```javascript
weatherService.generateMockWeatherData("Mumbai")
```

---

## 🔧 API Testing

### Using cURL

#### 1. Test Chatbot
```bash
curl -X POST http://localhost:5000/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-1",
    "message": "What is parametric insurance?",
    "language": "en"
  }'
```

#### 2. Create Wallet Account
```bash
curl -X POST http://localhost:5000/api/wallet \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-1",
    "accountType": "wallet",
    "balance": 100000,
    "currency": "INR"
  }'
```

#### 3. Get Action Logs
```bash
curl -X GET http://localhost:5000/api/action-logs
```

#### 4. Create Risk Prediction
```bash
curl -X POST http://localhost:5000/api/risk \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-1",
    "location": "Mumbai",
    "riskLevel": "high",
    "score": 78,
    "factors": {
      "windImpact": 85,
      "rainfallImpact": 90,
      "humidityImpact": 45,
      "temperatureImpact": 30
    }
  }'
```

### Using Postman

1. Import the API collection
2. Set environment variables
3. Test each endpoint
4. Verify responses

---

## 🐛 Troubleshooting

### Issue: Chatbot Not Responding
**Solution:**
1. Check API keys in `.env.local`
2. Verify internet connection
3. Check OpenAI/Gemini account has credits
4. Fallback responses should still work

### Issue: Wallet Functions Not Working
**Solution:**
1. Ensure user ID is correct
2. Check if accounts exist (create if needed)
3. Verify balance is sufficient for withdrawals
4. Check console for error messages

### Issue: WebSocket Connection Failed
**Solution:**
1. Verify server is running on port 5000
2. Check firewall settings
3. Clear browser cache
4. Try in incognito mode

### Issue: API Calls Return 400 Error
**Solution:**
1. Verify request body matches schema
2. Check all required fields are included
3. Validate data types
4. Use Postman to test with correct format

### Issue: Admin Dashboard Not Loading
**Solution:**
1. Ensure user role is set to "admin"
2. Login with admin account
3. Check console for routing errors
4. Verify /admin route is accessible

---

## 📱 Features Walkthrough

### 1. Dashboard Overview
- **Risk Gauges**: Visual representation of risk levels
- **KPI Cards**: Key metrics at a glance
- **Active Alerts**: Real-time weather-based alerts
- **Financial Actions**: Recommended protective actions
- **Recent Activity**: Timeline of all actions

### 2. Wallet Management
**Workflow:**
1. View both wallet and emergency savings accounts
2. Add funds using deposit feature
3. Monitor balance changes
4. Review all transactions
5. See automatic transfers during high-risk periods

### 3. Insurance Management
**Workflow:**
1. Browse available insurance plans
2. Enroll in appropriate coverage
3. Monitor active policies
4. Understand how parametric insurance works
5. See instant activation during risk events

### 4. EMI Management
**Workflow:**
1. View all active loans
2. See EMI payment details
3. Pause during emergencies (1-6 months)
4. Automatic tenure extension
5. Resume when situation improves

### 5. AI Chatbot
**Workflow:**
1. Click chat icon (bottom-right)
2. Ask questions in English or Hindi
3. Get AI-powered responses
4. Switch language with toggle
5. Use quick reply buttons

---

## 🎯 Key Features to Test

### Automatic Fund Transfer
```
Scenario: High-risk weather detected
Expected: 
  - Automatic transfer from Wallet to Emergency Savings
  - Notification sent to user
  - Transaction logged with timestamp
  - Real-time WebSocket update broadcast
```

### Insurance Activation
```
Scenario: Wind speed exceeds 50 km/h
Expected:
  - Risk prediction updated to "high"
  - Insurance policy triggered automatically
  - Coverage amount transferred to account
  - Action log created
```

### EMI Pause
```
Scenario: User clicks pause during medium-high risk
Expected:
  - EMI status changes to "paused"
  - Duration extension recorded
  - No additional interest charged
  - Bank notification sent
```

---

## 📈 Performance Monitoring

### Server Logs
Monitor the terminal where you ran `npm run dev`:
- API request/response times
- Error messages
- Database operations

### Browser DevTools
- Network tab: API response times
- Console: JavaScript errors
- Application tab: Local storage, session

### WebSocket Activity
- Network → WS in DevTools
- See real-time events broadcast
- Verify message structure

---

## 🔒 Security Notes

1. **Never commit `.env.local`** - Use `.env.example` instead
2. **API Keys**: Keep secret, rotate periodically
3. **User IDs**: Implement proper authentication
4. **Data Validation**: All inputs sanitized
5. **CORS**: Configure for production domains

---

## 📚 Additional Resources

### Documentation Files
- `IMPLEMENTATION_GUIDE.md` - Detailed feature documentation
- `server/services/weatherService.ts` - Weather integration
- `server/services/riskPredictionService.ts` - Risk model explanation
- `server/services/aiChatbotService.ts` - AI integration details

### External Resources
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [OpenWeather API Docs](https://openweathermap.org/api)

---

## 🚦 Common Commands

```bash
# Development
npm run dev              # Start development server
npm run check           # TypeScript type checking
npm run build           # Build for production

# Database (if configured)
npm run db:push         # Push schema to database

# Testing (when ready)
npm test                # Run test suite
npm run test:e2e        # End-to-end tests
```

---

## 🤝 Getting Help

If you encounter issues:

1. **Check Error Messages**: Read console errors carefully
2. **Review Logs**: Check server terminal output
3. **Test APIs**: Use curl/Postman to isolate issues
4. **Check Connections**: Verify WebSocket, database connections
5. **Review Code**: Check service files for implementation details

---

## 🎉 You're All Set!

Your Finance Resilience Advisor is now ready to:
- ✅ Predict weather-based risks
- ✅ Protect user finances automatically  
- ✅ Provide AI-powered financial guidance
- ✅ Manage insurance and EMI
- ✅ Monitor everything in real-time

**Happy coding!** 🚀

---

**Version**: 1.0  
**Last Updated**: March 17, 2026  
**Maintained By**: Finance Resilience Team
