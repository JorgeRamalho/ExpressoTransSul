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

Write-Host 'Gerando dist para o Live Server...' -ForegroundColor Cyan
& $npmCmd run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host 'Dist pronto. Pare o Live Server e clique em Go Live de novo.' -ForegroundColor Green
Write-Host 'URL: http://127.0.0.1:5500/' -ForegroundColor Green
Write-Host 'Mantenha esta janela aberta para atualizar o dist ao salvar.' -ForegroundColor Yellow

& $npmCmd run build:watch
