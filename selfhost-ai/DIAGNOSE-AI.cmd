@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Deutsch Mastery - Connection Check
where py >nul 2>nul
if %errorlevel%==0 (
 py -3 diagnose_ai.py
 goto :end
)
where python >nul 2>nul
if %errorlevel%==0 (
 python diagnose_ai.py
 goto :end
)
echo ERROR: Python is not installed.
:end
echo.
echo The report is also saved to Deutsch-AI-Report.txt
pause
