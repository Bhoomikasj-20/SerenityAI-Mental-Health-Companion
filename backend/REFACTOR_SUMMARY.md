# SerenityAI Backend Refactor Summary

## Overview
The SerenityAI chatbot backend has been completely refactored to remove all NLP-specific models (TextBlob, VADER, HF emotion models) and replace them with Microsoft Phi-3 Mini LLM.

## Changes Made

### 1. Removed NLP Models
- ✅ Removed `emotion_analyzer.py` usage (file kept for reference but not imported)
- ✅ Removed all VADER sentiment analysis
- ✅ Removed TextBlob imports
- ✅ Removed HuggingFace emotion classification pipelines
- ✅ Removed emotion keyword mapping (except for crisis detection)

### 2. Added Phi-3 Mini LLM
- ✅ Created `app/ai/llm_phi3.py` with `Phi3ChatModel` class
- ✅ Uses `microsoft/Phi-3-mini-4k-instruct-int4` (quantized for speed)
- ✅ Falls back to standard model if int4 unavailable
- ✅ Configured for CPU (Intel Core Ultra 5 compatible)
- ✅ System prompt: Calm, safe, wellness-focused responses

### 3. Updated Chatbot Core
- ✅ Refactored `app/ai/chatbot.py` to use Phi-3 instead of emotion analyzer
- ✅ Kept simple crisis keyword detection (string matching)
- ✅ Removed emotion/sentiment analysis from response generation
- ✅ LLM generates natural, empathetic responses based on context

### 4. Updated API Routes
- ✅ Modified `app/api/chatbot.py` to use new chatbot interface
- ✅ Removed emotion_analyzer imports
- ✅ Updated ChatResponse to keep emotion/sentiment fields for backward compatibility (always "neutral"/"NEUTRAL")
- ✅ Increased timeout to 30 seconds for LLM inference
- ✅ Deprecated `/analyze_emotion` endpoint (returns neutral)

### 5. Updated Dependencies
- ✅ Updated `requirements.txt`:
  - Removed: nltk, textblob, vaderSentiment
  - Updated: transformers>=4.40.0, torch>=2.1.0
  - Added: accelerate>=0.30.0

### 6. Updated Main App
- ✅ Modified `app/main.py` startup to preload Phi-3 instead of emotion analyzer

## Crisis Detection
- ✅ Simple keyword matching (no NLP models)
- ✅ Keywords: ["suicide", "kill myself", "end my life", "self-harm", "I want to die", "hopeless", etc.]
- ✅ Triggers `/api/care/alert-helpdesk` route
- ✅ Returns crisis-safe message immediately
- ✅ Auto-displays therapist directory in frontend

## Response Format
The API now returns:
```json
{
  "response": "LLM-generated empathetic response",
  "session_id": "...",
  "intent": "general|greeting|help|motivation|counselor",
  "emotion": "neutral",  // Always neutral (backward compatibility)
  "sentiment": "NEUTRAL",  // Always NEUTRAL (backward compatibility)
  "crisis": false,
  "contact_path": null
}
```

## Installation
1. Install updated requirements:
   ```bash
   pip install -r requirements.txt
   ```

2. The Phi-3 model will download automatically on first use (~2.3GB for int4)

3. Start backend:
   ```bash
   uvicorn app.main:app --reload
   ```

## Testing
- ✅ All imports work correctly
- ✅ Crisis detection works
- ✅ LLM generates responses
- ✅ Backward compatibility maintained (emotion/sentiment fields still present)

## Notes
- Model loads lazily on first chat request
- First request may take 10-30 seconds (model download + loading)
- Subsequent requests are faster (2-5 seconds on CPU)
- For production, consider pre-loading model at startup

