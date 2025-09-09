@echo off
REM Windows-friendly API Startup Script
cd /d "%~dp0"

REM Check for virtual environment folder 'venv'
IF EXIST "venv\Scripts\activate.bat" (
    call "venv\Scripts\activate.bat"
    echo ✅ Virtual environment activated
) ELSE (
    echo ❌ Virtual environment not found. Run:
    echo python -m venv venv; call venv\Scripts\activate.bat; pip install -r requirements.txt
    exit /b 1
)

echo 🚀 Starting API Server...
python server.py
