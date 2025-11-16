"""
AI Emotional Companion - Phi-3 Mini LLM with emotion routing
"""

from typing import Dict, List
import logging
from app.ai.llm_phi3 import get_phi3_model, build_prompt
from app.ai.emotion_analyzer import EmotionAnalyzer

logger = logging.getLogger(__name__)

# Emotion to action redirect mapping
EMOTION_ACTION_MAP = {
    "happy": "gratitude",
    "sad": "journal",
    "stress": "relaxation",
    "anxiety": "relaxation",
    "anger": "breathing",
    "neutral": None,
    "crisis": "therapist"
}


class EmotionalCompanion:
    """AI-powered emotional companion using Phi-3 Mini LLM with emotion routing"""
    
    def __init__(self):
        self.conversation_history = {}  # user_id -> List[Dict] with role/content
        self.phi3_model = None
        self.emotion_analyzer = EmotionAnalyzer()
        
    def _get_model(self):
        """Lazy load Phi-3 model"""
        if self.phi3_model is None:
            try:
                self.phi3_model = get_phi3_model()
            except Exception as e:
                logger.error(f"Failed to load Phi-3 model: {e}")
        return self.phi3_model
    
    def generate_response(self, user_message: str, user_id: str = None) -> Dict:
        """
        Generate empathetic response using emotion routing and Phi-3 Mini LLM
        
        Flow:
        1. Analyze emotion FIRST
        2. If crisis → return crisis response (skip LLM)
        3. Get chat history
        4. Build structured prompt with emotion context
        5. Generate Phi-3 response
        6. Determine redirect from emotion
        7. Update history
        
        Args:
            user_message: User's message
            user_id: User ID for conversation history
            
        Returns:
            Dict with reply, emotion, redirect, etc.
        """
        try:
            # Step 1: Analyze emotion BEFORE Phi-3
            emotion_result = self.emotion_analyzer.analyze_emotion(user_message)
            emotion = emotion_result['emotion']
            sentiment_result = self.emotion_analyzer.analyze_sentiment(user_message)
            sentiment = sentiment_result['label']
            
            # Step 2: Crisis handling - skip LLM
            if emotion == 'crisis':
                crisis_response = (
                    "I'm really glad you reached out. You're not alone. "
                    "I am connecting you to counselor support now."
                )
                
                # Update history
                if user_id:
                    history = self.conversation_history.get(user_id, [])
                    history.append({"role": "user", "content": user_message})
                    history.append({"role": "assistant", "content": crisis_response})
                    self.conversation_history[user_id] = history
                
                return {
                    "reply": crisis_response,
                    "response": crisis_response,
                    "emotion": "crisis",
                    "sentiment": "negative",
                    "redirect": "therapist",
                    "crisis": True,
                    "contact_path": "/care/contact"
                }
            
            # Step 3: Get chat history for this user
            history = self.conversation_history.get(user_id, [])
            
            # Step 4: Build structured prompt with emotion context
            model = self._get_model()
            if model is None:
                # Fallback if model fails to load
                fallback = "I'm here to support you. Could you tell me more about what you're experiencing?"
                return {
                    "reply": fallback,
                    "response": fallback,
                    "emotion": emotion,
                    "sentiment": sentiment,
                    "redirect": EMOTION_ACTION_MAP.get(emotion),
                    "crisis": False
                }
            
            # Add current user message to history for prompt building
            history_with_current = history + [{"role": "user", "content": user_message}]
            
            # Step 5: Generate Phi-3 response with structured prompt
            reply = model.generate_response_with_history(
                history=history_with_current,
                emotion=emotion,
                sentiment=sentiment
            )
            
            # Step 6: Determine redirect from emotion
            redirect = EMOTION_ACTION_MAP.get(emotion)
            
            # Step 7: Update conversation history
            if user_id:
                history.append({"role": "user", "content": user_message})
                history.append({"role": "assistant", "content": reply})
                # Keep last 20 messages to avoid context overflow
                if len(history) > 20:
                    history = history[-20:]
                self.conversation_history[user_id] = history
            
            return {
                "reply": reply,
                "response": reply,
                "emotion": emotion,
                "sentiment": sentiment,
                "redirect": redirect,
                "crisis": False
            }
        
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            import traceback
            traceback.print_exc()
            return {
                "reply": "I'm here to support you. Could you tell me more about what you're experiencing?",
                "response": "I'm here to support you. Could you tell me more about what you're experiencing?",
                "emotion": "neutral",
                "sentiment": "neutral",
                "redirect": None,
                "crisis": False
            }
    
    def get_conversation_history(self, user_id: str) -> List[Dict]:
        """Get conversation history for a user in proper format"""
        return self.conversation_history.get(user_id, [])


# Global instance
companion = EmotionalCompanion()
