"""
Simple script to start the backend server with error handling
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    import uvicorn
    from app.main import app
    
    print("=" * 50)
    print("Starting Innovaden Backend Server")
    print("=" * 50)
    print(f"Server will be available at: http://localhost:8000")
    print(f"API Documentation: http://localhost:8000/docs")
    print("=" * 50)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
except ImportError as e:
    print(f"Error importing dependencies: {e}")
    print("Please make sure you have installed all requirements:")
    print("  pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"Error starting server: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

