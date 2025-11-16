"""
Configuration settings for Innovaden backend
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./innovaden.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    # AI Model
    AI_MODEL_PATH: str = "models/emotion_model"
    SENTIMENT_MODEL: str = "cardiffnlp/twitter-roberta-base-sentiment-latest"
    
    # Blockchain
    BLOCKCHAIN_NETWORK: str = "testnet"
    ETHEREUM_RPC_URL: str = "https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
    
    # Gamification
    POINTS_PER_CHALLENGE: int = 10
    POINTS_PER_CHAT: int = 5
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

