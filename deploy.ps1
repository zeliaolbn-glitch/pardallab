# Deploy Script para Windows PowerShell
# Executa os comandos de deploy remotos na Hostinger

$ip = "46.202.145.77"
$port = "65002"
$user = "u183568280"
$appDir = "/home/u183568280/domains/lawngreen-kudu-132132.hostingersite.com/public_html"

$remoteCmd = "export PATH=/opt/alt/alt-nodejs22/root/bin:/bin:/usr/bin:/usr/local/bin:`$PATH; " +
             "export RAYON_NUM_THREADS=1; " +
             "export UV_THREADPOOL_SIZE=1; " +
             "set -e; " +
             "cd `"$appDir`"; " +
             "git fetch origin; " +
             "git reset --hard origin/main; " +
             "npm ci; " +
             "npm run build; " +
             "rm -rf ../nodejs/public/*; " +
             "cp -r dist/* ../nodejs/public/; " +
             "cp backend_hostinger/server.js ../nodejs/app.js; " +
             "cp backend_hostinger/package.json ../nodejs/package.json; " +
             "rm -f index.html; " +
             "cd ../nodejs; " +
             "npm install --omit=dev; " +
             "mkdir -p tmp; " +
             "touch tmp/restart.txt"

Write-Host "Iniciando Deploy na Hostinger via SSH..." -ForegroundColor Cyan

if (Test-Path "hostinger_deploy_key") {
    ssh -i hostinger_deploy_key -o StrictHostKeyChecking=no -p $port "$user@$ip" $remoteCmd
} else {
    Write-Host "Chave hostinger_deploy_key não encontrada localmente. Tentando conexão padrão..." -ForegroundColor Yellow
    ssh -o StrictHostKeyChecking=no -p $port "$user@$ip" $remoteCmd
}

Write-Host "Deploy Concluído com Sucesso!" -ForegroundColor Green
