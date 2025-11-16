# Chatbot Integration Guide

## Overview

The chatbot component (`ChatInterface.jsx`) now uses the centralized API service (`api.js`) to communicate with the FastAPI backend.

## Flow

### 1. User Sends Message

```javascript
// User types message and clicks send
sendMessage() {
  // Message is sent via API service
  const response = await api.post('/chatbot/chat', {
    message: messageToSend,
    session_id: sessionId
  })
}
```

### 2. API Service Handles Request

```javascript
// api.js automatically:
// 1. Adds authentication token from localStorage
// 2. Sets base URL (uses Vite proxy or direct URL)
// 3. Adds proper headers
// 4. Handles errors
```

### 3. Backend Processes Request

```python
# backend/app/api/chatbot.py
@router.post("/chat")
async def chat(request: ChatRequest, current_user: User):
    # 1. Generates AI response using EmotionalCompanion
    # 2. Creates/retrieves chat session
    # 3. Saves message to database
    # 4. Stores encrypted data on blockchain
    # 5. Returns response with emotion, intent, sentiment
```

### 4. Frontend Displays Response

```javascript
// ChatInterface receives response and displays:
// - Bot message
// - Emotion detected
// - Intent classified
// - Coping strategies (if applicable)
```

## Features

### ✅ Automatic Authentication

- API service automatically adds JWT token to all requests
- Token is retrieved from localStorage
- No manual token handling needed in components

### ✅ Error Handling

- Network errors are caught and displayed to user
- 401 errors automatically redirect to login
- Specific error messages for different scenarios
- Error messages are styled differently (red background)

### ✅ Chat History

- Automatically loads chat history when session ID is available
- Preserves conversation context
- Seamless user experience

### ✅ Real-time Updates

- Optimistic UI updates (message appears immediately)
- Loading states during API calls
- Smooth scrolling to latest message

### ✅ Debug Logging

- Development mode logs all API requests/responses
- Helps with debugging connection issues
- Only active in development mode

## API Endpoints Used

### POST `/api/chatbot/chat`

**Request:**

```json
{
  "message": "I'm feeling stressed",
  "session_id": "session_123_1234567890" // optional
}
```

**Response:**

```json
{
  "response": "I understand you're feeling stressed...",
  "session_id": "session_123_1234567890",
  "intent": "stress",
  "emotion": "sadness",
  "sentiment": "NEGATIVE",
  "coping_strategy": "Try the 4-7-8 breathing technique..."
}
```

### GET `/api/chatbot/history/{session_id}`

**Response:**

```json
[
  {
    "id": 1,
    "message": "Hello",
    "response": "Hi! How can I help?",
    "sentiment": "NEUTRAL",
    "emotion": "neutral",
    "intent": "general",
    "created_at": "2024-01-01T12:00:00"
  }
]
```

## Configuration

### API Base URL

The API service uses:

- Vite proxy: `/api` (if `VITE_API_URL` is not set)
- Direct URL: `http://localhost:8000` (if `VITE_API_URL` is set)

### Vite Proxy

In `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  }
}
```

This means:

- Frontend requests to `/api/chatbot/chat`
- Vite proxy forwards to `http://localhost:8000/api/chatbot/chat`
- No CORS issues in development

## Testing

### 1. Start Backend

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

### 3. Test Chatbot

1. Login to the application
2. Navigate to Dashboard > AI Companion
3. Type a message (e.g., "I'm feeling anxious")
4. Check browser console for API logs
5. Verify response appears in chat
6. Check backend terminal for request logs

### 4. Verify API Calls

Open browser DevTools:

- **Network tab**: See all API requests
- **Console tab**: See debug logs from API service
- **Application tab**: See localStorage token

## Troubleshooting

### Issue: "Cannot connect to server"

**Solution:**

1. Verify backend is running on port 8000
2. Check `vite.config.js` proxy configuration
3. Check browser console for specific error
4. Verify CORS settings in backend

### Issue: 401 Unauthorized

**Solution:**

1. Check if token exists in localStorage
2. Verify token is valid (not expired)
3. Try logging in again
4. Check backend logs for auth errors

### Issue: Messages not sending

**Solution:**

1. Check browser console for errors
2. Verify API service is imported correctly
3. Check network tab for failed requests
4. Verify backend endpoint is working (test in `/docs`)

### Issue: Chat history not loading

**Solution:**

1. Verify session_id is set
2. Check backend endpoint `/api/chatbot/history/{session_id}`
3. Check browser console for errors
4. Verify database has chat messages

## Next Steps

1. ✅ Chatbot integrated with API service
2. ✅ Error handling implemented
3. ✅ Chat history loading
4. ✅ Debug logging enabled
5. ✅ Authentication automatic

The chatbot is now fully integrated and ready to use!
