import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  showConfirmedOnly: boolean;
  onFilterChange: (showConfirmedOnly: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  showConfirmedOnly,
  onFilterChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Buscar por nome, telefone ou email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
        
        <button
          onClick={() => onFilterChange(!showConfirmedOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
            showConfirmedOnly
              ? 'bg-accent-500 text-white hover:bg-accent-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">
            {showConfirmedOnly ? 'Só Confirmados' : 'Todos'}
          </span>
        </button>
      </div>
    </div>
  );
};