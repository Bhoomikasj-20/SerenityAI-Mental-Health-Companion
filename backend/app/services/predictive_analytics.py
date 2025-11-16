"""
Predictive Analytics Service for Mental Health Risk Detection
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os
from typing import Dict, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import MoodLog
import logging

logger = logging.getLogger(__name__)


class PredictiveAnalytics:
    """Predict mental health risks using ML models"""
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        # Use absolute path relative to backend directory
        # File is in backend/app/services/, so go up to backend/
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.model_path = os.path.join(backend_dir, "models", "stress_predictor.pkl")
        self._model_loaded = False
    
    def _ensure_model_loaded(self):
        """Lazy load model on first use"""
        if not self._model_loaded:
            self._load_or_create_model()
            self._model_loaded = True
    
    def _load_or_create_model(self):
        """Load existing model or create a new one"""
        try:
            if os.path.exists(self.model_path):
                try:
                    self.model = joblib.load(self.model_path)
                    # Load scaler if it exists, otherwise create new one
                    scaler_path = self.model_path.replace(".pkl", "_scaler.pkl")
                    if os.path.exists(scaler_path):
                        self.scaler = joblib.load(scaler_path)
                    else:
                        # If model exists but scaler doesn't, create new scaler
                        logger.warning("Model found but scaler not found. Creating new scaler.")
                        self.scaler = StandardScaler()
                        # Fit scaler with dummy data to avoid errors
                        dummy_data = np.array([[5, 5, 5, 0, 0]])
                        self.scaler.fit(dummy_data)
                    logger.info("Loaded existing predictive model")
                except Exception as e:
                    logger.error(f"Error loading model: {e}")
                    self._create_model()
            else:
                self._create_model()
        except Exception as e:
            logger.error(f"Error in model loading: {e}")
            # Create a simple fallback model
            self._create_model()
    
    def _create_model(self):
        """Create and train a new predictive model"""
        # Generate synthetic training data (in production, use real data)
        np.random.seed(42)
        n_samples = 1000
        
        # Features: mood_score, stress_level, anxiety_level, days_since_last_log, chat_frequency
        X = np.random.rand(n_samples, 5)
        X[:, 0] = np.random.randint(1, 11, n_samples)  # mood_score
        X[:, 1] = np.random.randint(1, 11, n_samples)  # stress_level
        X[:, 2] = np.random.randint(1, 11, n_samples)  # anxiety_level
        X[:, 3] = np.random.randint(0, 30, n_samples)  # days_since_last_log
        X[:, 4] = np.random.randint(0, 10, n_samples)  # chat_frequency
        
        # Target: risk_level (0=low, 1=medium, 2=high)
        y = np.zeros(n_samples)
        y[(X[:, 1] > 7) | (X[:, 2] > 7)] = 1  # medium risk
        y[(X[:, 1] > 8) & (X[:, 2] > 8)] = 2  # high risk
        
        # Train model
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train_scaled, y_train)
        
        # Save model
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)
        # Save scaler
        scaler_path = self.model_path.replace(".pkl", "_scaler.pkl")
        joblib.dump(self.scaler, scaler_path)
        logger.info("Created and saved new predictive model")
    
    def predict_risk(self, mood_score: int, stress_level: int, anxiety_level: int,
                    days_since_last_log: int = 0, chat_frequency: int = 0) -> Dict:
        """Predict mental health risk level"""
        self._ensure_model_loaded()
        try:
            if self.model is None:
                raise ValueError("Model not loaded")
            
            # Prepare features
            features = np.array([[mood_score, stress_level, anxiety_level, 
                                days_since_last_log, chat_frequency]])
            
            # Scale features
            try:
                features_scaled = self.scaler.transform(features)
            except (ValueError, AttributeError):
                # If scaler is not fitted, fit it with the current feature
                logger.warning("Scaler not fitted, fitting with current data")
                self.scaler.fit(features)
                features_scaled = self.scaler.transform(features)
            
            # Predict
            risk_level = self.model.predict(features_scaled)[0]
            risk_proba = self.model.predict_proba(features_scaled)[0]
            
            risk_labels = {0: "low", 1: "medium", 2: "high"}
            risk_label = risk_labels.get(int(risk_level), "low")
            
            return {
                "risk_level": risk_label,
                "risk_score": int(risk_level),
                "confidence": float(max(risk_proba)),
                "probabilities": {
                    "low": float(risk_proba[0]),
                    "medium": float(risk_proba[1]),
                    "high": float(risk_proba[2])
                }
            }
        except Exception as e:
            logger.error(f"Error in risk prediction: {e}")
            return {
                "risk_level": "low",
                "risk_score": 0,
                "confidence": 0.5,
                "probabilities": {"low": 0.5, "medium": 0.3, "high": 0.2}
            }
    
    def analyze_user_trends(self, db: Session, user_id: int, days: int = 30) -> Dict:
        """Analyze user mood trends over time"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            logs = db.query(MoodLog).filter(
                MoodLog.user_id == user_id,
                MoodLog.created_at >= cutoff_date
            ).order_by(MoodLog.created_at).all()
            
            if not logs:
                return {
                    "trend": "stable",
                    "average_mood": 5,
                    "average_stress": 5,
                    "average_anxiety": 5,
                    "data_points": 0
                }
            
            moods = [log.mood_score for log in logs]
            stresses = [log.stress_level for log in logs]
            anxieties = [log.anxiety_level for log in logs]
            
            # Calculate trend
            if len(moods) > 1:
                mood_trend = "improving" if moods[-1] > moods[0] else "declining" if moods[-1] < moods[0] else "stable"
                stress_trend = "improving" if stresses[-1] < stresses[0] else "declining" if stresses[-1] > stresses[0] else "stable"
            else:
                mood_trend = stress_trend = "stable"
            
            return {
                "trend": mood_trend,
                "stress_trend": stress_trend,
                "average_mood": float(np.mean(moods)),
                "average_stress": float(np.mean(stresses)),
                "average_anxiety": float(np.mean(anxieties)),
                "data_points": len(logs),
                "latest_mood": int(moods[-1]),
                "latest_stress": int(stresses[-1]),
                "latest_anxiety": int(anxieties[-1])
            }
        except Exception as e:
            logger.error(f"Error analyzing trends: {e}")
            return {
                "trend": "stable",
                "average_mood": 5,
                "average_stress": 5,
                "average_anxiety": 5,
                "data_points": 0
            }


# Global instance
predictive_analytics = PredictiveAnalytics()

