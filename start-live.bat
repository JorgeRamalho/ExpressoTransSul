@echo off
setlocal
set "PROJECT_ROOT=%~dp0"
set "PATH=%PROJECT_ROOT%.tools\node;%PATH%"
cd /d "%PROJECT_ROOT%"
echo Gerando dist para o Live Server...
call npm run build
if errorlevel 1 (
  echo Falha no build. Abra start-live.bat de novo depois de corrigir o erro.
  pause
  exit /b 1
)
echo.
echo Dist pronto. No Cursor/VS Code: pare o Live Server e clique em Go Live de novo.
echo URL: http://127.0.0.1:5500/
echo Mantenha esta janela aberta para atualizar o dist ao salvar.
echo.
call npm run build:watch
