@echo off
cd /d "%~dp0"
echo Starting EcosysAI dev server...
start "EcosysAI" cmd /c "npx next dev -p 3000"
echo EcosysAI is running at http://localhost:3000
echo Close this window or run stop.bat to stop it.
timeout /t 3 /nobreak >nul
