
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import VeegoxDEX from '@/components/defi/VeegoxDEX';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const DEX = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="card-glassmorphism p-12 text-center">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Authentification requise</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Connectez-vous pour accéder au DEX VeegoxChain et échanger vos tokens.
              </p>
              <Link to="/auth">
                <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                  Se connecter
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Veegox<span className="gradient-text">DEX</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Échangez vos tokens VEX, sVEX et gVEX sur la blockchain VeegoxChain
            </p>
          </div>

          <VeegoxDEX />
        </div>
      </div>
    </div>
  );
};

export default DEX;
