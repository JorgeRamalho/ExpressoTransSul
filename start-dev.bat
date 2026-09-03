@echo off
setlocal
set "PROJECT_ROOT=%~dp0"
set "PATH=%PROJECT_ROOT%.tools\node;%PATH%"
cd /d "%PROJECT_ROOT%"
echo Iniciando API + Vite...
echo Frontend: http://127.0.0.1:5173
echo API:      http://127.0.0.1:3001
npm run dev:full
