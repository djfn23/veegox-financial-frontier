
# Script PowerShell pour deployer VeegoxChain
Write-Host "Deploiement de VeegoxChain" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

# Verifier le repertoire courant
$currentDir = Get-Location
Write-Host "Repertoire actuel: $currentDir" -ForegroundColor Yellow

# Aller dans le dossier contracts s'il existe
if (Test-Path "package.json") {
    Write-Host "Fichier package.json trouve" -ForegroundColor Green
} else {
    Write-Host "package.json non trouve. Tentative de navigation..." -ForegroundColor Red
    if (Test-Path "..\contracts\package.json") {
        Set-Location "..\contracts"
        Write-Host "Navigation vers le dossier contracts reussie" -ForegroundColor Green
    } else {
        Write-Host "Impossible de trouver le dossier contracts" -ForegroundColor Red
        exit 1
    }
}

# Verifier le fichier .env
if (Test-Path ".env") {
    Write-Host "Fichier .env trouve" -ForegroundColor Green
} else {
    Write-Host "Fichier .env non trouve" -ForegroundColor Red
    exit 1
}

try {
    Write-Host "Installation complete des dependances..." -ForegroundColor Cyan
    npm install --save-dev "@nomicfoundation/hardhat-chai-matchers@^2.0.0" "@nomicfoundation/hardhat-ethers@^3.0.0" "@nomicfoundation/hardhat-network-helpers@^1.0.0" "@nomicfoundation/hardhat-verify@^2.0.0" "@typechain/ethers-v6@^0.5.0" "@typechain/hardhat@^9.0.0" "@types/chai@^4.2.0" "@types/mocha@^10.0.0" "chai@^4.2.0" "ethers@^6.4.0" "hardhat-gas-reporter@^1.0.8" "solidity-coverage@^0.8.1" "ts-node@^10.0.0" "typechain@^8.3.0" "typescript@^5.0.0"
    if ($LASTEXITCODE -ne 0) { throw "Erreur installation dependances" }

    Write-Host "Installation des dependances principales..." -ForegroundColor Cyan
    npm install "@openzeppelin/contracts@^4.9.3" "dotenv@^16.3.1"
    if ($LASTEXITCODE -ne 0) { throw "Erreur installation dependances principales" }

    Write-Host "Nettoyage du cache..." -ForegroundColor Cyan
    if (Test-Path "cache") { Remove-Item -Recurse -Force "cache" }
    if (Test-Path "artifacts") { Remove-Item -Recurse -Force "artifacts" }

    Write-Host "Compilation des contrats..." -ForegroundColor Cyan
    npx hardhat clean
    npx hardhat compile --force
    if ($LASTEXITCODE -ne 0) { throw "Erreur compilation" }

    Write-Host "Deploiement sur Sepolia..." -ForegroundColor Cyan
    npx hardhat run scripts/deploy-veegoxchain.js --network sepolia
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deploiement termine avec succes!" -ForegroundColor Green
    } else {
        throw "Erreur deploiement"
    }
} catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Processus termine!" -ForegroundColor Green
