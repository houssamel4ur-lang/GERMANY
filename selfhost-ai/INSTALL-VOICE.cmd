@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Deutsch Mastery - Free German Voice Setup

where py >nul 2>nul
if not errorlevel 1 (
  set "PYTHON=py -3"
) else (
  where python >nul 2>nul
  if not errorlevel 1 (
    set "PYTHON=python"
  ) else (
    echo ERROR: Python 3 not found. Install from python.org.
    goto :failed
  )
)
echo ======================================================
echo Deutsch Mastery - LOCAL voice setup - Whisper + Piper
echo No paid voice API and no user microphone uploads.
echo ======================================================
echo.
echo [1/3] Checking Python speech packages...
%PYTHON% -m pip install "faster-whisper>=1.1,<2" "piper-tts>=1.3,<2"
if errorlevel 1 goto :failed

if not exist "%~dp0voices" mkdir "%~dp0voices"
if exist "%~dp0voices\de_DE-thorsten-high.onnx" if exist "%~dp0voices\de_DE-thorsten-high.onnx.json" goto :downloaded
echo.
echo [2/3] Downloading free German Piper voice (one-time)...
%PYTHON% -m piper.download_voices --data-dir "%~dp0voices" de_DE-thorsten-high
if errorlevel 1 goto :failed
:downloaded
echo.
echo [3/3] Validating real Piper German audio + offline Whisper recognition...
echo Whisper may download the free base model on first installation.
%PYTHON% "%~dp0PREPARE-VOICE.py"
if errorlevel 1 goto :failed
echo.
echo SUCCESS: German speech and microphone engines are installed and tested.
echo Restart the AI server, refresh the page, then test both call and voice.
if /I "%~1"=="--no-pause" exit /b 0
pause
exit /b 0
:failed
echo.
echo ERROR: Voice setup is incomplete. Review the error above.
echo Written German chat can still work without audio.
if /I "%~1"=="--no-pause" exit /b 1
pause
exit /b 1
