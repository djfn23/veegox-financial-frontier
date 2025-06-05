
@echo off
echo 🚀 Déploiement de VeegoxChain sur Windows
echo ==========================================

REM Vérifier si nous sommes dans le bon répertoire
if not exist "package.json" (
    echo ❌ Erreur: package.json non trouvé. Navigation vers le dossier contracts...
    cd /d "%~dp0"
)

REM Vérifier que le fichier .env existe
if not exist ".env" (
    echo ❌ Erreur: fichier .env non trouvé.
    pause
    exit /b 1
)

echo ✅ Variables d'environnement vérifiées

echo 📦 Installation des dépendances...
call npm install --no-optional --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

echo 🧹 Nettoyage du cache...
if exist "cache" rmdir /s /q cache
if exist "artifacts" rmdir /s /q artifacts

echo 🔨 Compilation des contrats...
call npx hardhat clean
call npx hardhat compile --force
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la compilation
    pause
    exit /b 1
)

echo 🌐 Déploiement sur Sepolia...
call npx hardhat run scripts/deploy-veegoxchain.js --network sepolia
if %errorlevel% equ 0 (
    echo ✅ Déploiement terminé avec succès!
    echo 📄 Vérifiez les fichiers générés dans le dossier contracts/
) else (
    echo ❌ Erreur lors du déploiement
)

pause
