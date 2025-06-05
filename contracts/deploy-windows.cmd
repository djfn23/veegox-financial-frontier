
@echo off
echo 🚀 Deploiement VeegoxChain - Windows
echo ==================================

REM Verifier le repertoire
if not exist "package.json" (
    echo ❌ package.json non trouve
    echo Assurez-vous d'etre dans le dossier contracts
    pause
    exit /b 1
)

REM Verifier .env
if not exist ".env" (
    echo ❌ Fichier .env manquant
    pause
    exit /b 1
)

echo ✅ Verification de l'environnement...
call node scripts/verify-environment.js
if %errorlevel% neq 0 (
    echo ❌ Environnement non valide
    pause
    exit /b 1
)

echo 📦 Lancement du deploiement complet...
call node scripts/complete-deployment.js
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du deploiement
    pause
    exit /b 1
)

echo 📄 Post-traitement...
call node scripts/post-deployment.js

echo 🎉 Deploiement termine avec succes !
pause
