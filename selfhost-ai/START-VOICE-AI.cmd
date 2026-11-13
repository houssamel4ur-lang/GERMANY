@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Deutsch Mastery - German AI + VOICE + CALL
echo ==========================================================
echo DEUTSCH MASTERY - GERMAN AUDIO + LOCAL CALL - FREE
echo Whisper speech recognition + Piper German speech + Ollama
echo ==========================================================
echo.
echo [1/5] Checking localhost 8787...
powershell -NoProfile -Command "try{$c=New-Object Net.Sockets.TcpClient; $c.Connect('127.0.0.1',8787); $c.Close();exit 1}catch{exit 0}"
if %errorlevel% NEQ 0 (
 echo.
 echo PORT 8787 ALREADY USED: close the old BLACK Deutsch AI window first.
 echo Do not close Ollama itself. Then run START-VOICE-AI.cmd again.
 goto :failed
)
echo.
echo [2/5] Downloading current local scripts from your own GitHub...
if exist local_bridge.py copy /y local_bridge.py local_bridge.backup.py >nul
powershell -NoProfile -Command "$ErrorActionPreference='Stop'; $root='%~dp0'; $base='https://raw.githubusercontent.com/houssamel4ur-lang/GERMANY/main/selfhost-ai/'; foreach($name in @('local_bridge.py','INSTALL-VOICE.cmd','PREPARE-VOICE.py')) { Invoke-WebRequest -UseBasicParsing -TimeoutSec 45 -Uri ($base+$name) -OutFile (Join-Path $root $name) }"
if errorlevel 1 (
 echo Failed to download updated files. Check internet connection.
 goto :failed
)
findstr /C:"2026.11.13.6" local_bridge.py >nul
if errorlevel 1 (
 echo GitHub scripts are not the latest version. Do not run an outdated bridge.
 goto :failed
)
echo.
echo [3/5] Checking free local AI model...
where ollama >nul 2>nul
if errorlevel 1 (
 echo Ollama not found. Install free Ollama from ollama.com first.
 goto :failed
)
ollama list | findstr /C:"llama3.2:3b" >nul
if errorlevel 1 (
 echo First installation: downloading llama3.2:3b (roughly 2GB).
 ollama pull llama3.2:3b
 if errorlevel 1 goto :failed
)
echo.
echo [4/5] Checking ACCURATE multilingual German Whisper-small + Piper setup...
set "DEUTSCH_STT_MODEL=small"
if exist "voices\.piper-ready" if exist "voices\.whisper-small-ready" goto :speechready
call "%~dp0INSTALL-VOICE.cmd" --no-pause
if errorlevel 1 (
 echo.
 echo Could not verify speech engines; written chat can still work.
 echo Check installation errors above; rerun START-VOICE-AI.cmd after fixing.
 goto :failed
)
:speechready
echo.
echo [5/5] Starting Deutsch Partner with microphone and German voice...
set "DEUTSCH_AI_MODEL=llama3.2:3b"
where py >nul 2>nul
if %errorlevel%==0 (
 py -3 "%~dp0local_bridge.py"
 goto :done
)
where python >nul 2>nul
if %errorlevel%==0 (
 python "%~dp0local_bridge.py"
 goto :done
)
echo Python 3 not found. Install free Python from python.org and rerun.
goto :failed
:failed
echo.
echo Setup could not finish. Take a screenshot of the error above.
:done
echo.
echo Keep this BLACK window OPEN to use voice and calls on the website.
pause
