#!/usr/bin/env python3
"""
Test script to verify the chatbot is working properly
"""

import sys
sys.path.insert(0, '/d/projects/SerinityAI/backend')

from app.ai.chatbot import companion
from app.ai.emotion_analyzer import EmotionAnalyzer

def test_chatbot():
    """Test the chatbot response generation"""
    print("=" * 60)
    print("Testing Chatbot Responses")
    print("=" * 60)
    
    test_messages = [
        "Hello, how are you?",
        "I'm feeling stressed about work",
        "I have anxiety about exams",
        "I'm feeling depressed",
        "I need motivation",
        "I can't sleep",
        "My relationships are complicated",
        "Academic pressure is overwhelming",
        "Hi there",
        "Tell me about coping strategies",
    ]
    
    for message in test_messages:
        print(f"\nUser: {message}")
        try:
            response = companion.generate_response(message, user_id="test_user")
            print(f"Bot: {response['response']}")
            print(f"Intent: {response['intent']}")
            print(f"Emotion: {response['emotion']}")
            print(f"Sentiment: {response['sentiment']}")
            if response.get('coping_strategy'):
                print(f"Coping Strategy: {response['coping_strategy']}")
            print("-" * 60)
        except Exception as e:
            print(f"ERROR: {e}")
            import traceback
            traceback.print_exc()
            print("-" * 60)

def test_emotion_analyzer():
    """Test the emotion analyzer"""
    print("\n" + "=" * 60)
    print("Testing Emotion Analyzer")
    print("=" * 60)
    
    analyzer = EmotionAnalyzer()
    
    test_texts = [
        "I'm feeling great!",
        "I'm so sad and depressed",
        "This makes me anxious",
        "I'm stressed out",
    ]
    
    for text in test_texts:
        print(f"\nText: {text}")
        try:
            analysis = analyzer.analyze(text)
            print(f"Analysis: {analysis}")
            print("-" * 60)
        except Exception as e:
            print(f"ERROR: {e}")
            import traceback
            traceback.print_exc()
            print("-" * 60)

if __name__ == "__main__":
    test_chatbot()
    test_emotion_analyzer()
    print("\n" + "=" * 60)
    print("Tests Complete!")
    print("=" * 60)
