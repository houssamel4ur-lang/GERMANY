@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Deutsch Mastery - Free German Voice Setup
where py >nul 2>nul
if %errorlevel%==0 (
  set "PYTHON=py -3"
) else (
  set "PYTHON=python"
)
echo Installing offline Whisper and Piper (no paid API)...
%PYTHON% -m pip install --upgrade "faster-whisper>=1.1,<2" "piper-tts>=1.3,<2"
if errorlevel 1 goto failed
if not exist voices mkdir voices
echo Downloading German Piper voice...
%PYTHON% -m piper.download_voices --data-dir "%~dp0voices" de_DE-thorsten-high
if errorlevel 1 goto failed
echo.
echo German voice installed.
echo Close and restart START-DEUTSCH-AI.cmd, then press Test Connection on the website.
echo First microphone use may download the free Whisper base model.
goto done
:failed
echo Voice installation failed. Check your Python version and internet, then retry.
echo Text chat will continue working without voice.
:done
pause
