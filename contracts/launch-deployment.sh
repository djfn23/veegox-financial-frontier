
#!/bin/bash

echo "🚀 Lancement du déploiement VeegoxChain"
echo "======================================"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le dossier contracts."
    exit 1
fi

# Vérifier que le fichier .env existe
if [ ! -f ".env" ]; then
    echo "❌ Erreur: fichier .env non trouvé."
    exit 1
fi

echo "📦 Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo "🔨 Compilation des contrats..."
npm run compile

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la compilation"
    exit 1
fi

echo "🌐 Déploiement sur Sepolia..."
npm run deploy:veegoxchain:sepolia

if [ $? -eq 0 ]; then
    echo "✅ Déploiement terminé avec succès!"
    echo "📄 Vérifiez les fichiers générés dans le dossier contracts/"
else
    echo "❌ Erreur lors du déploiement"
    exit 1
fi
