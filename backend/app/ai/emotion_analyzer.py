"""
Emotion Analyzer - Classifies emotions before LLM processing
Classifies: happy, sad, stress, anxiety, anger, crisis, neutral
"""

from typing import Dict
import logging
import re

logger = logging.getLogger(__name__)

# Crisis keywords (must be checked first)
CRISIS_KEYWORDS = [
    "suicide", "kill myself", "end my life", "self-harm", 
    "I want to die", "hopeless", "no point", "better off dead",
    "hurt myself", "end it all", "not worth living", "want to die"
]


class EmotionAnalyzer:
    """Fast emotion classifier using keyword-based heuristics"""

    def __init__(self):
        # Emotion keyword patterns (order matters - more specific first)
        self.emotion_keywords = {
            'happy': [
                r'\bhappy\b', r'\bglad\b', r'\bjoy\b', r'\bgreat\b', r'\bgood\b',
                r'\bexcited\b', r'\bthrilled\b', r'\bpleased\b', r'\bdelighted\b',
                r'\bwonderful\b', r'\bfantastic\b', r'\bamazing\b'
            ],
            'sad': [
                r'\bsad\b', r'\bdepress', r'\bdown\b', r'\blonely\b', r'\bempty\b',
                r'\bmiserable\b', r'\bunhappy\b', r'\bdisappointed\b', r'\bupset\b',
                r'\btearful\b', r'\bcrying\b', r'\bheartbroken\b'
            ],
            'stress': [
                r'\bstress', r'\bstressed\b', r'\boverwhelm', r'\bpressure\b',
                r'\bpressured\b', r'\btense\b', r'\bstrained\b', r'\bexhausted\b',
                r'\bburnt out\b', r'\bburnout\b', r'\boverworked\b'
            ],
            'anxiety': [
                r'\banxious\b', r'\banxiety\b', r'\bpanic\b', r'\bnervous\b', r'\bworried\b',
                r'\bworries\b', r'\bfearful\b', r'\bscared\b', r'\buneasy\b', r'\bapprehensive\b',
                r'\btense\b', r'\brestless\b'
            ],
            'anger': [
                r'\bangry\b', r'\bfrustrat', r'\birritat', r'\bmad\b', r'\bannoyed\b',
                r'\bfurious\b', r'\brage\b', r'\bresentful\b', r'\bhostile\b'
            ]
        }

    def analyze_emotion(self, text: str) -> Dict[str, any]:
        """
        Analyze emotion from text
        
        Returns:
            Dict with 'emotion' (str) and 'score' (float)
        """
        if not text:
            return {'emotion': 'neutral', 'score': 0.5}
        
        text_lower = text.lower()
        
        # Crisis detection first (highest priority)
        for keyword in CRISIS_KEYWORDS:
            if keyword in text_lower:
                return {'emotion': 'crisis', 'score': 1.0}
        
        # Check emotion keywords (order: happy, sad, stress, anxiety, anger)
        emotion_scores = {}
        for emotion, patterns in self.emotion_keywords.items():
            matches = sum(1 for pattern in patterns if re.search(pattern, text_lower))
            if matches > 0:
                emotion_scores[emotion] = min(0.5 + (matches * 0.15), 1.0)
        
        # Return highest scoring emotion, or neutral
        if emotion_scores:
            best_emotion = max(emotion_scores.items(), key=lambda x: x[1])
            detected_emotion = best_emotion[0]
            # Map "joy" to "happy" if needed (shouldn't happen with current keywords, but safety check)
            if detected_emotion == 'joy':
                detected_emotion = 'happy'
            return {'emotion': detected_emotion, 'score': best_emotion[1]}
        
        return {'emotion': 'neutral', 'score': 0.5}
    
    def analyze_sentiment(self, text: str) -> Dict[str, any]:
        """
        Simple sentiment analysis (positive/negative/neutral)
        
        Returns:
            Dict with 'label' (str) and 'score' (float)
        """
        if not text:
            return {'label': 'neutral', 'score': 0.0}
        
        text_lower = text.lower()
        
        # Positive indicators
        positive_words = ['happy', 'good', 'great', 'well', 'fine', 'okay', 'ok', 'better', 'glad', 'excited']
        negative_words = ['sad', 'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'disappointed', 'upset']
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return {'label': 'positive', 'score': 0.6}
        elif negative_count > positive_count:
            return {'label': 'negative', 'score': -0.6}
        else:
            return {'label': 'neutral', 'score': 0.0}
    
    def analyze(self, text: str) -> Dict:
        """
        Combined analysis: emotion + sentiment
        
        Returns:
            Dict with emotion, sentiment, and scores
        """
        emotion_result = self.analyze_emotion(text)
        sentiment_result = self.analyze_sentiment(text)
        
        return {
            'emotion': emotion_result['emotion'],
            'emotion_score': emotion_result['score'],
            'sentiment': sentiment_result['label'],
            'sentiment_score': sentiment_result['score']
        }
