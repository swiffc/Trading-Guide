@echo off
cls
echo.
echo ========================================
echo   TRADING GUIDE - SERVER MODE
echo ========================================
echo.
echo Starting local web server for best compatibility...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python not found! Using direct file access instead...
    echo.
    echo Opening app directly...
    start index.html
    echo.
    echo If you get errors, please install Python for best experience.
    pause
    exit
)

echo Python found! Starting HTTP server...
echo.
echo ========================================
echo   SERVER STARTING
echo ========================================
echo.
echo Server URL: http://localhost:8000
echo.
echo Your browser will open automatically in 3 seconds...
echo.
echo To STOP the server: Press Ctrl+C in this window
echo.
echo ========================================
echo.

REM Wait 2 seconds then open browser
timeout /t 2 /nobreak >nul
start http://localhost:8000/index.html

echo Browser opened! Server is running...
echo.
echo Keep this window OPEN while using the app!
echo Close this window when done to stop the server.
echo.
echo ========================================
echo.

REM Start Python HTTP server
python -m http.server 8000

echo.
echo Server stopped.
pause



