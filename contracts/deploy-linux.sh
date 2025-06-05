
#!/bin/bash

echo "🚀 Déploiement VeegoxChain - Linux/Mac"
echo "====================================="

# Vérifier le répertoire
if [ ! -f "package.json" ]; then
    echo "❌ package.json non trouvé"
    echo "Assurez-vous d'être dans le dossier contracts"
    exit 1
fi

# Vérifier .env
if [ ! -f ".env" ]; then
    echo "❌ Fichier .env manquant"
    exit 1
fi

echo "✅ Vérification de l'environnement..."
node scripts/verify-environment.js
if [ $? -ne 0 ]; then
    echo "❌ Environnement non valide"
    exit 1
fi

echo "📦 Lancement du déploiement complet..."
node scripts/complete-deployment.js
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du déploiement"
    exit 1
fi

echo "📄 Post-traitement..."
node scripts/post-deployment.js

echo "🎉 Déploiement terminé avec succès !"
