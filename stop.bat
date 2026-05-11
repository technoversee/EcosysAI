@echo off
cd /d "%~dp0"
echo Stopping EcosysAI dev server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 .*LISTENING"') do taskkill /f /pid %%a >nul 2>&1
echo Stopped.
