
# Script PowerShell pour déployer VeegoxChain
Write-Host "🚀 Déploiement de VeegoxChain" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

# Vérifier le répertoire courant
$currentDir = Get-Location
Write-Host "📍 Répertoire actuel: $currentDir" -ForegroundColor Yellow

# Aller dans le dossier contracts s'il existe
if (Test-Path "package.json") {
    Write-Host "✅ Fichier package.json trouvé" -ForegroundColor Green
} else {
    Write-Host "❌ package.json non trouvé. Tentative de navigation..." -ForegroundColor Red
    if (Test-Path "..\contracts\package.json") {
        Set-Location "..\contracts"
        Write-Host "✅ Navigation vers le dossier contracts réussie" -ForegroundColor Green
    } else {
        Write-Host "❌ Impossible de trouver le dossier contracts" -ForegroundColor Red
        exit 1
    }
}

# Vérifier le fichier .env
if (Test-Path ".env") {
    Write-Host "✅ Fichier .env trouvé" -ForegroundColor Green
} else {
    Write-Host "❌ Fichier .env non trouvé" -ForegroundColor Red
    exit 1
}

try {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Cyan
    npm install --no-optional --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) { throw "Erreur installation" }

    Write-Host "🧹 Nettoyage du cache..." -ForegroundColor Cyan
    if (Test-Path "cache") { Remove-Item -Recurse -Force "cache" }
    if (Test-Path "artifacts") { Remove-Item -Recurse -Force "artifacts" }

    Write-Host "🔨 Compilation des contrats..." -ForegroundColor Cyan
    npx hardhat clean
    npx hardhat compile --force
    if ($LASTEXITCODE -ne 0) { throw "Erreur compilation" }

    Write-Host "🌐 Déploiement sur Sepolia..." -ForegroundColor Cyan
    npx hardhat run scripts/deploy-veegoxchain.js --network sepolia
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Déploiement terminé avec succès!" -ForegroundColor Green
    } else {
        throw "Erreur déploiement"
    }
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Processus terminé!" -ForegroundColor Green
