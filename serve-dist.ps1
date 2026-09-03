# Serve a pasta dist na porta 5500 (fallback sem Node/Live Server).
# Uso: clique direito → Executar com PowerShell  OU  .\serve-dist.ps1

$ErrorActionPreference = 'Stop'
$port = 5500
$root = Join-Path $PSScriptRoot 'dist'

if (-not (Test-Path (Join-Path $root 'index.html'))) {
  Write-Host "ERRO: dist/index.html nao encontrado. Rode 'npm run build' primeiro." -ForegroundColor Red
  exit 1
}

$prefix = "http://127.0.0.1:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
  $listener.Start()
} catch {
  Write-Host "ERRO: nao foi possivel ouvir $prefix (porta em uso?)." -ForegroundColor Red
  Write-Host $_.Exception.Message
  exit 1
}

Write-Host "Servindo $root" -ForegroundColor Green
Write-Host "Abra: $prefix" -ForegroundColor Cyan
Write-Host "Ctrl+C para parar." -ForegroundColor DarkGray
Start-Process $prefix

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.js'   = 'text/javascript; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.webp' = 'image/webp'
  '.ico'  = 'image/x-icon'
  '.json' = 'application/json'
  '.map'  = 'application/json'
  '.woff' = 'font/woff'
  '.woff2'= 'font/woff2'
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $reqPath = [Uri]::UnescapeDataString($ctx.Request.Url.LocalPath.TrimStart('/'))
  if ([string]::IsNullOrWhiteSpace($reqPath)) { $reqPath = 'index.html' }

  $full = [System.IO.Path]::GetFullPath((Join-Path $root $reqPath))
  $rootFull = [System.IO.Path]::GetFullPath($root)

  if (-not $full.StartsWith($rootFull, [StringComparison]::OrdinalIgnoreCase)) {
    $ctx.Response.StatusCode = 403
    $ctx.Response.Close()
    continue
  }

  if (-not (Test-Path $full -PathType Leaf)) {
    # SPA fallback
    $full = Join-Path $root 'index.html'
  }

  try {
    $bytes = [System.IO.File]::ReadAllBytes($full)
    $ext = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
    $ctx.Response.ContentType = $(if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' })
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } catch {
    $ctx.Response.StatusCode = 500
  } finally {
    $ctx.Response.OutputStream.Close()
  }
}
