$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodeDir = Join-Path $projectRoot '.tools\node'
$nodeExe = Join-Path $nodeDir 'node.exe'
$npmCmd = Join-Path $nodeDir 'npm.cmd'

if (-not (Test-Path $nodeExe)) {
  Write-Host 'Node.js portatil nao encontrado. Execute setup-node.ps1 primeiro.' -ForegroundColor Red
  exit 1
}

$env:Path = "$nodeDir;" + $env:Path
Set-Location $projectRoot

Write-Host 'Iniciando API + Vite (frontend + backend)...' -ForegroundColor Cyan
Write-Host 'Frontend: http://127.0.0.1:5173' -ForegroundColor Green
Write-Host 'API:      http://127.0.0.1:3001' -ForegroundColor Green
Write-Host 'Pressione Ctrl+C para parar.' -ForegroundColor Yellow

& $npmCmd run dev:full
