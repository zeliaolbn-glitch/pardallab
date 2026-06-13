@echo off
rem Install script for Windows

rem Create virtual environment
python -m venv .venv
call .\.venv\Scripts\activate

rem Install Node dependencies
npm ci

rem Install Python dependencies (if any)
if exist requirements.txt (
  pip install -r requirements.txt
)

rem Copy example .env if missing
if not exist .env copy .env.example .env

rem Finished
echo Installation completed.
pause
