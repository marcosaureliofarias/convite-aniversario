import React from 'react';
import { Users, UserPlus } from 'lucide-react';

interface EmptyStateProps {
  isSearching: boolean;
  onAddGuest: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isSearching, onAddGuest }) => {
  if (isSearching) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Nenhum convidado encontrado
        </h3>
        <p className="text-gray-500">
          Tente ajustar sua busca ou filtros
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        Sua lista está vazia
      </h3>
      <p className="text-gray-500 mb-6">
        Comece adicionando seus convidados para o aniversário
      </p>
      <button
        onClick={onAddGuest}
        className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
      >
        <UserPlus className="w-5 h-5" />
        Adicionar Primeiro Convidado
      </button>
    </div>
  );
};