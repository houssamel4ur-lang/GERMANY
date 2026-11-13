@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Deutsch Mastery - Local AI Qwen3 4B
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
echo Python 3 was not found on your PC.
echo Install free Python from https://www.python.org/downloads/windows/
echo Then double-click this file again. Ollama/Qwen3 need not be downloaded again.
:done
echo.
echo Press any key to close this window...
pause >nul
