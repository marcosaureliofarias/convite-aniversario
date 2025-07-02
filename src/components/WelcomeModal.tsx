import React, { useState } from 'react';
import { Info, Users, Settings, Heart, Star, Shield } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { AdminLoginModal } from './AdminLoginModal';

export const WelcomeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { setViewMode, isAuthenticated } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!isOpen) return null;

  const handleGoToAdmin = () => {
    if (isAuthenticated) {
      setViewMode('admin');
      onClose();
    } else {
      setShowLoginModal(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setViewMode('admin');
    onClose();
  };

  const handleStayUser = () => {
    setViewMode('user');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Bem-vindo ao Sistema de Gerenciamento
          </h2>
          <h3 className="text-xl text-purple-600 font-semibold mb-2">
            🎂 Aniversário do Marcos Farias
          </h3>
          <p className="text-gray-600 text-lg">
            Escolha como você quer acessar o sistema
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* User View */}
          <div className="border-2 border-blue-200 rounded-2xl p-6 hover:border-blue-400 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-800">Tela de Convidado</h3>
                <p className="text-blue-600 text-sm">Para quem foi convidado</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700">Ver detalhes do aniversário</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700">Adicionar seu nome à lista</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700">Confirmar presença via WhatsApp</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700">Ver quem já confirmou presença</span>
              </div>
            </div>
            
            <button
              onClick={handleStayUser}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-4 px-6 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Entrar como Convidado
            </button>
          </div>

          {/* Admin View */}
          <div className="border-2 border-red-200 rounded-2xl p-6 hover:border-red-400 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-red-50 to-pink-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800">Painel Administrativo</h3>
                <p className="text-red-600 text-sm">Para organizadores do evento</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-red-500" />
                <span className="text-gray-700">Gerenciar lista completa de convidados</span>
              </div>
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-red-500" />
                <span className="text-gray-700">Adicionar/editar/remover convidados</span>
              </div>
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-red-500" />
                <span className="text-gray-700">Ver estatísticas detalhadas</span>
              </div>
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-red-500" />
                <span className="text-gray-700">Exportar dados e relatórios</span>
              </div>
            </div>
            
            <button
              onClick={handleGoToAdmin}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-4 px-6 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Entrar como Administrador
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-gray-800 mb-2">💡 Dica Importante:</h4>
              <div className="space-y-2 text-gray-700">
                <p>• <strong>Convidados:</strong> Use a tela de convidado para se adicionar à lista e confirmar presença</p>
                <p>• <strong>Organizadores:</strong> Use o painel administrativo para gerenciar todo o evento</p>
                <p>• <strong>Alternância:</strong> Você pode alternar entre as duas visualizações a qualquer momento usando o botão no canto superior direito</p>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
          >
            Fechar e continuar navegando
          </button>
        </div>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
};
