import React from 'react';
import { Cake, Users, CheckCircle, Clock } from 'lucide-react';
import { InvitationStats } from '../types';

interface HeaderProps {
  stats: InvitationStats;
}

export const Header: React.FC<HeaderProps> = ({ stats }) => {
  return (
    <header className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Cake className="w-8 h-8 animate-bounce-subtle" />
          <div>
            <h1 className="text-2xl font-bold">Aniversário</h1>
            <p className="text-primary-100 text-sm">Marcos Farias</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Confirmados</span>
            </div>
            <p className="text-2xl font-bold text-accent-200">{stats.confirmed}</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Pendentes</span>
            </div>
            <p className="text-2xl font-bold text-secondary-200">{stats.pending}</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Taxa</span>
            </div>
            <p className="text-2xl font-bold">{stats.confirmationRate.toFixed(0)}%</p>
          </div>
        </div>
      </div>
    </header>
  );
};