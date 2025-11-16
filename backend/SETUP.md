# Backend Setup Guide

## ✅ Fixed Issues

### 1. Configuration File (`app/config.py`)
- ✅ Fixed syntax error in `DATABASE_URL` type annotation
- ✅ Removed misplaced `settings = Settings()` from inside class definition
- ✅ Database URL set to SQLite for easy development

### 2. Database Configuration (`app/database.py`)
- ✅ Updated to use modern SQLAlchemy `declarative_base` import
- ✅ Added conditional handling for SQLite vs PostgreSQL
- ✅ Proper connection args for SQLite

### 3. Model Imports (`app/main.py`)
- ✅ Added explicit model imports to ensure all models are registered before table creation
- ✅ Proper import order to avoid circular dependencies

### 4. Missing `__init__.py` Files
- ✅ Created `app/ai/__init__.py`
- ✅ Created `app/blockchain/__init__.py`
- ✅ Created `app/models/__init__.py` with model exports
- ✅ Created `app/services/__init__.py`

### 5. AI Model Loading (`app/ai/emotion_analyzer.py`)
- ✅ Changed to lazy loading to avoid startup errors
- ✅ Added fallback error handling
- ✅ Models only load when first used

### 6. Predictive Analytics (`app/services/predictive_analytics.py`)
- ✅ Changed to lazy loading to avoid startup errors
- ✅ Fixed model path calculation
- ✅ Added proper scaler handling
- ✅ Added error handling for missing scaler files

### 7. Chatbot (`app/ai/chatbot.py`)
- ✅ Fixed sentiment label checking to handle various model outputs
- ✅ Added better error handling

## 🚀 Running the Backend

### Option 1: Using uvicorn directly
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### Option 2: Using the start script
```bash
cd backend
python start_server.py
```

### Option 3: Using the main file
```bash
cd backend
python -m app.main
```

## 📋 Prerequisites

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Database Setup**
   - SQLite database will be created automatically at `innovaden.db`
   - For PostgreSQL, update `DATABASE_URL` in `app/config.py` or `.env` file

3. **Environment Variables (Optional)**
   - Create a `.env` file in the `backend` directory if you want to override default settings
   - See `.env.example` for reference

## 🔍 Verification

Once the server starts, you should see:
- Server running on `http://localhost:8000`
- API documentation at `http://localhost:8000/docs`
- Health check at `http://localhost:8000/health`

## 📝 Notes

- AI models (transformers) will download on first use - this may take some time
- ML models will be created automatically on first use
- SQLite database is created automatically
- All models use lazy loading to prevent startup delays

## 🐛 Troubleshooting

### Import Errors
- Make sure you're running from the `backend` directory
- Check that all dependencies are installed: `pip install -r requirements.txt`

### Database Errors
- For SQLite: Make sure the directory is writable
- For PostgreSQL: Make sure the database exists and credentials are correct

### AI Model Errors
- Models will download automatically on first use
- If download fails, check your internet connection
- Fallback models will be used if primary models fail to load

### Port Already in Use
- Change the port in `app/main.py` or use: `--port 8001`

