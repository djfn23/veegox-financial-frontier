
import React from 'react';
import Navigation from '@/components/layout/Navigation';

const CrowdfundingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              <span className="gradient-text">Crowdfunding</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Financez et soutenez des projets innovants dans l'écosystème VeegoxDeFi
            </p>
          </div>

          {/* Coming Soon Card */}
          <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Bientôt Disponible</h3>
              <p className="text-gray-400 mb-6">
                Notre plateforme de crowdfunding décentralisée est en cours de développement. 
                Vous pourrez bientôt créer et financer des projets blockchain innovants.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-2">💡 Projets Innovants</h4>
                <p className="text-sm text-gray-400">
                  Découvrez et financez les prochaines innovations DeFi
                </p>
              </div>

              <div className="p-4 bg-gray-700/30 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-2">🔒 Sécurisé</h4>
                <p className="text-sm text-gray-400">
                  Smart contracts audités pour des investissements sûrs
                </p>
              </div>

              <div className="p-4 bg-gray-700/30 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-2">🎯 Transparent</h4>
                <p className="text-sm text-gray-400">
                  Suivi en temps réel des fonds et des projets
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdfundingPage;
