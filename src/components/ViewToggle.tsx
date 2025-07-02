import React, { useState } from 'react';
import { Settings, Users, Shield, User, LogOut } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { AdminLoginModal } from './AdminLoginModal';

export const ViewToggle: React.FC = () => {
  const { viewMode, setViewMode, isAuthenticated, logout } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleToggleClick = () => {
    if (viewMode === 'user') {
      // Tentando ir para admin
      if (isAuthenticated) {
        setViewMode('admin');
      } else {
        setShowLoginModal(true);
      }
    } else {
      // Voltando para user
      setViewMode('user');
    }
  };

  const handleLoginSuccess = () => {
    setViewMode('admin');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="fixed top-6 right-6 z-50">
        <div className="flex items-center gap-3">
          {/* Current Mode Indicator */}
          <div className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-lg border-2 ${
            viewMode === 'admin' 
              ? 'bg-red-100 text-red-800 border-red-200' 
              : 'bg-blue-100 text-blue-800 border-blue-200'
          }`}>
            {viewMode === 'admin' ? (
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Modo Administrador</span>
                <span className="sm:hidden">Admin</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Modo Convidado</span>
                <span className="sm:hidden">Convidado</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Toggle Button */}
            <button
              onClick={handleToggleClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg transition-all duration-300 font-semibold border-2 hover:scale-105 ${
                viewMode === 'admin'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-400 hover:border-blue-500'
                  : 'bg-red-500 hover:bg-red-600 text-white border-red-400 hover:border-red-500'
              }`}
              title={viewMode === 'admin' ? 'Alternar para Modo Convidado' : 'Alternar para Modo Administrador'}
            >
              {viewMode === 'admin' ? (
                <>
                  <Users className="w-5 h-5" />
                  <span className="hidden sm:inline">Modo Convidado</span>
                </>
              ) : (
                <>
                  <Settings className="w-5 h-5" />
                  <span className="hidden sm:inline">Modo Admin</span>
                </>
              )}
            </button>

            {/* Logout Button (only show in admin mode) */}
            {viewMode === 'admin' && isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg bg-red-600 hover:bg-red-700 text-white border-2 border-red-500 hover:border-red-600 transition-all duration-300 font-medium"
                title="Fazer Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Sair</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Helper text */}
        <div className="mt-2 text-right">
          <div className={`text-xs px-2 py-1 rounded-lg ${
            viewMode === 'admin' 
              ? 'text-red-600 bg-red-50' 
              : 'text-blue-600 bg-blue-50'
          }`}>
            {viewMode === 'admin' 
              ? '⚡ Controle total do sistema' 
              : '🎉 Experiência do convidado'
            }
            {viewMode === 'admin' && isAuthenticated && (
              <span className="block text-xs text-red-500 mt-1">
                Logado como administrador
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};
