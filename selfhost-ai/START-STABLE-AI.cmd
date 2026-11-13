@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Deutsch Mastery - STABLE AI - Llama 3.2 3B
echo ================================================================
echo Deutsch Mastery - RELIABLE German AI Mode - No paid APIs
echo Model: llama3.2:3b (German, non-thinking, ~2GB download once)
echo ================================================================
echo.
echo [1/4] Checking if an old Deutsch AI server is still running...
powershell -NoProfile -Command "try{$c=New-Object Net.Sockets.TcpClient; $c.Connect('127.0.0.1',8787);$c.Close();exit 1}catch{exit 0}"
if %errorlevel% NEQ 0 (
 echo.
 echo ERROR: port 8787 is already in use by an older AI server.
 echo Close the OLD BLACK START-DEUTSCH-AI window first.
 echo Then double-click this START-STABLE-AI.cmd again.
 goto :end
)
echo.
echo [2/4] Updating the local Python bridge from YOUR GitHub project...
if exist local_bridge.py copy /y local_bridge.py local_bridge.backup.py >nul
powershell -NoProfile -Command "$ErrorActionPreference='Stop'; Invoke-WebRequest -UseBasicParsing -TimeoutSec 40 -Uri 'https://raw.githubusercontent.com/houssamel4ur-lang/GERMANY/main/selfhost-ai/local_bridge.py' -OutFile 'local_bridge.py'"
if %errorlevel% NEQ 0 (
 echo ERROR: cannot download local_bridge.py from your GitHub.
 echo Check internet connection or antivirus and retry.
 goto :end
)
findstr /C:"2026.11.13.5" local_bridge.py >nul
if %errorlevel% NEQ 0 (
 echo ERROR: the GitHub bridge has not updated yet. Retry later.
 goto :end
)
echo.
echo [3/4] Installing/storing the free non-thinking model...
where ollama >nul 2>nul
if %errorlevel% NEQ 0 (
 echo ERROR: Ollama could not be found on Windows.
 goto :end
)
ollama pull llama3.2:3b
if %errorlevel% NEQ 0 (
 echo ERROR: model download did not complete. Retry this file.
 goto :end
)
echo.
echo [4/4] Starting your private local German AI...
set "DEUTSCH_AI_MODEL=llama3.2:3b"
where py >nul 2>nul
if %errorlevel%==0 (
 py -3 local_bridge.py
 goto :end
)
where python >nul 2>nul
if %errorlevel%==0 (
 python local_bridge.py
 goto :end
)
echo ERROR: Python 3 missing. Install from python.org and retry.
:end
echo.
echo Leave this window OPEN while chatting. Press any key to close.
pause >nul
