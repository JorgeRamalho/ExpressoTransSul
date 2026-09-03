$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$toolsDir = Join-Path $projectRoot '.tools'
$nodeDir = Join-Path $toolsDir 'node'
$zipPath = Join-Path $toolsDir 'node.zip'
$nodeVersion = 'v22.14.0'
$nodeUrl = "https://nodejs.org/dist/$nodeVersion/node-$nodeVersion-win-x64.zip"

New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null

if (Test-Path (Join-Path $nodeDir 'node.exe')) {
  Write-Host "Node.js ja instalado em $nodeDir" -ForegroundColor Green
} else {
  Write-Host "Baixando Node.js $nodeVersion..." -ForegroundColor Cyan
  Invoke-WebRequest -Uri $nodeUrl -OutFile $zipPath -UseBasicParsing
  Write-Host 'Extraindo...' -ForegroundColor Cyan
  Expand-Archive -Path $zipPath -DestinationPath $toolsDir -Force
  Rename-Item -Path (Join-Path $toolsDir "node-$nodeVersion-win-x64") -NewName 'node' -Force
  Remove-Item $zipPath -Force
  Write-Host 'Node.js instalado com sucesso.' -ForegroundColor Green
}

$nodeExe = Join-Path $nodeDir 'node.exe'
$npmCmd = Join-Path $nodeDir 'npm.cmd'
& $nodeExe --version
& $npmCmd --version

Set-Location $projectRoot
Write-Host 'Instalando dependencias do projeto...' -ForegroundColor Cyan
& $npmCmd install

Write-Host ''
Write-Host 'Pronto! Para iniciar o projeto, execute:' -ForegroundColor Green
Write-Host '  .\start-dev.ps1' -ForegroundColor Yellow
