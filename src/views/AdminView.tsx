import React, { useState, useMemo } from 'react';
import { Shield, Users, UserCheck, Clock, TrendingUp, Download, BarChart3 } from 'lucide-react';
import { GuestCard } from '../components/GuestCard';
import { GuestForm } from '../components/GuestForm';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/EmptyState';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { useGuests } from '../hooks/useGuests';
import { Guest } from '../types';

// Your WhatsApp number for confirmations (replace with your actual number)
const HOST_PHONE = '5521985317129'; // Format: 55 + area code + number

export const AdminView: React.FC = () => {
  const { guests, loading, error, addGuest, editGuest, removeGuest, confirmGuestPresence, getStats } = useGuests();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmedOnly, setShowConfirmedOnly] = useState(false);

  const stats = getStats();

  const filteredGuests = useMemo(() => {
    let filtered = guests;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(guest =>
        guest.name.toLowerCase().includes(query) ||
        guest.phone.includes(searchQuery) ||
        guest.email?.toLowerCase().includes(query)
      );
    }

    // Apply confirmation filter
    if (showConfirmedOnly) {
      filtered = filtered.filter(guest => guest.confirmed);
    }

    // Sort by confirmation status and name
    return filtered.sort((a, b) => {
      if (a.confirmed !== b.confirmed) {
        return a.confirmed ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }, [guests, searchQuery, showConfirmedOnly]);

  const handleSaveGuest = async (guestData: Omit<Guest, 'id' | 'invitedAt'>) => {
    try {
      if (editingGuest) {
        await editGuest(editingGuest.id, guestData);
      } else {
        await addGuest(guestData);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Erro ao salvar convidado:', error);
    }
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setIsFormOpen(true);
  };

  const handleDeleteGuest = async (id: string) => {
    if (window.confirm('⚠️ Tem certeza que deseja remover este convidado da lista?\n\nEsta ação não pode ser desfeita.')) {
      try {
        await removeGuest(id);
      } catch (error) {
        console.error('Erro ao remover convidado:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingGuest(undefined);
  };

  const handleOpenForm = () => {
    setEditingGuest(undefined);
    setIsFormOpen(true);
  };

  const exportGuestList = () => {
    const dataToExport = {
      event: {
        name: "Aniversário do Marcos Farias",
        date: "15 de Julho de 2025",
        location: "Salão de Festas Premium"
      },
      stats,
      guests: guests.map(guest => ({
        name: guest.name,
        phone: guest.phone,
        email: guest.email,
        confirmed: guest.confirmed,
        confirmedAt: guest.confirmedAt,
        invitedAt: guest.invitedAt,
        notes: guest.notes
      })),
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `convidados-aniversario-marcos-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Carregando Painel</h2>
          <p className="text-gray-600">Acessando dados do sistema...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-8xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Erro no Sistema</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Admin Header */}
      <header className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Shield className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Painel Administrativo</h1>
                <p className="text-red-100">Sistema de Gerenciamento - Aniversário Marcos Farias</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={exportGuestList}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
                title="Exportar lista de convidados"
              >
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
              
              <button
                onClick={handleOpenForm}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
              >
                <Users className="w-5 h-5" />
                <span className="hidden sm:inline">Novo Convidado</span>
              </button>
            </div>
          </div>
          
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6" />
                <span className="font-medium">Total de Convidados</span>
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm text-red-200 mt-1">Lista completa</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <UserCheck className="w-6 h-6" />
                <span className="font-medium">Confirmados</span>
              </div>
              <p className="text-3xl font-bold text-green-300">{stats.confirmed}</p>
              <p className="text-sm text-red-200 mt-1">Presença garantida</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-6 h-6" />
                <span className="font-medium">Pendentes</span>
              </div>
              <p className="text-3xl font-bold text-yellow-300">{stats.pending}</p>
              <p className="text-sm text-red-200 mt-1">Aguardando resposta</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6" />
                <span className="font-medium">Taxa de Confirmação</span>
              </div>
              <p className="text-3xl font-bold">{Math.round(stats.confirmationRate)}%</p>
              <p className="text-sm text-red-200 mt-1">
                {stats.confirmationRate >= 70 ? 'Excelente!' : stats.confirmationRate >= 50 ? 'Boa!' : 'Pode melhorar'}
              </p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-6 h-6" />
                <span className="font-medium">Estimativa Final</span>
              </div>
              <p className="text-3xl font-bold text-blue-300">{Math.round(stats.total * (stats.confirmationRate / 100) * 1.1)}</p>
              <p className="text-sm text-red-200 mt-1">Pessoas na festa</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Admin Tools Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Ferramentas Administrativas
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
              <h3 className="font-medium text-gray-800 mb-2">Gerenciamento Completo</h3>
              <p className="text-sm text-gray-600 mb-3">Adicione, edite e remova convidados com controle total</p>
              <div className="text-xs text-green-600 font-medium">✓ Acesso total</div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
              <h3 className="font-medium text-gray-800 mb-2">Confirmações via WhatsApp</h3>
              <p className="text-sm text-gray-600 mb-3">Facilite confirmações diretas via WhatsApp</p>
              <div className="text-xs text-green-600 font-medium">✓ Integração ativa</div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
              <h3 className="font-medium text-gray-800 mb-2">Relatórios e Exportação</h3>
              <p className="text-sm text-gray-600 mb-3">Exporte dados e acompanhe estatísticas</p>
              <div className="text-xs text-green-600 font-medium">✓ Dados disponíveis</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          showConfirmedOnly={showConfirmedOnly}
          onFilterChange={setShowConfirmedOnly}
        />

        {/* Guest Management */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Lista de Convidados ({filteredGuests.length})
              </h2>
              <div className="text-sm text-gray-600">
                {searchQuery || showConfirmedOnly ? (
                  <span>Filtrado de {guests.length} total</span>
                ) : (
                  <span>Mostrando todos os convidados</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {filteredGuests.length === 0 ? (
              <EmptyState 
                isSearching={!!searchQuery || showConfirmedOnly} 
                onAddGuest={handleOpenForm}
              />
            ) : (
              <div className="grid gap-4">
                {filteredGuests.map((guest) => (
                  <GuestCard
                    key={guest.id}
                    guest={guest}
                    onConfirm={confirmGuestPresence}
                    onEdit={handleEditGuest}
                    onDelete={handleDeleteGuest}
                    hostPhone={HOST_PHONE}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton onClick={handleOpenForm} />

        {/* Guest Form Modal */}
        <GuestForm
          guest={editingGuest}
          onSave={handleSaveGuest}
          onCancel={handleCloseForm}
          isOpen={isFormOpen}
        />
      </div>
    </div>
  );
};
