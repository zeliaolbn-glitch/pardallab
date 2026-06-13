## Backup script – creates backup.zip excluding node_modules, venv, __pycache__, and .env files

$excludePattern = 'node_modules|venv|__pycache__|\.env|netlify\.toml'

$files = Get-ChildItem -Path . -Recurse -File | Where-Object { $_.FullName -notmatch $excludePattern } | ForEach-Object { $_.FullName } | Select-Object -Unique

if ($files) {
    Compress-Archive -Path $files -DestinationPath backup.zip -Force
    Write-Host "Backup created: $(Resolve-Path .\\backup.zip)"
} else {
    Write-Host "No files found to backup."
}
