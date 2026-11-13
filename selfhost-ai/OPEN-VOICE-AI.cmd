@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Deutsch Mastery - Voice Launcher / Troubleshooting
echo ============================================================
echo Deutsch Mastery - voice startup with persistent diagnostics
echo ============================================================
echo.
echo Folder: "%~dp0"
echo.
if not exist "%~dp0START-VOICE-AI.cmd" (
  echo ERROR: START-VOICE-AI.cmd is missing.
  echo Please click "Extract all" on the ZIP and run this file
  echo from the extracted folder, NOT directly inside the ZIP.
  goto :finish
)
echo Launching the local German voice server...
echo This window will remain open even if the setup fails.
echo.
call "%~dp0START-VOICE-AI.cmd"
echo.
echo ============================================================
echo Deutsch Mastery setup returned to the launcher.
echo If the server is NOT running, read the error messages ABOVE.
echo If you see "PORT 8787 ALREADY USED", close the old server
echo window, then run OPEN-VOICE-AI.cmd again.
echo ============================================================
:finish
echo.
echo This window is waiting so that errors cannot disappear.
echo Press any key ONLY when you are done reading the output.
pause >nul
