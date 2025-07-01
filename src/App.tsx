import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { GuestCard } from './components/GuestCard';
import { GuestForm } from './components/GuestForm';
import { SearchBar } from './components/SearchBar';
import { EmptyState } from './components/EmptyState';
import { FloatingActionButton } from './components/FloatingActionButton';
import { useGuests } from './hooks/useGuests';
import { Guest } from './types';

// Your WhatsApp number for confirmations (replace with your actual number)
const HOST_PHONE = '5511999999999'; // Format: 55 + area code + number

function App() {
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
      // O erro já está sendo tratado no hook useGuests
    }
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setIsFormOpen(true);
  };

  const handleDeleteGuest = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este convidado?')) {
      try {
        await removeGuest(id);
      } catch (error) {
        console.error('Erro ao remover convidado:', error);
        // O erro já está sendo tratado no hook useGuests
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando convites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erro de Conexão</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header stats={stats} />
      
      <main className="max-w-4xl mx-auto p-4">
        {guests.length > 0 && (
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            showConfirmedOnly={showConfirmedOnly}
            onFilterChange={setShowConfirmedOnly}
          />
        )}

        {filteredGuests.length === 0 ? (
          <EmptyState 
            isSearching={searchQuery.trim() !== '' || showConfirmedOnly}
            onAddGuest={handleOpenForm}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

        <FloatingActionButton onClick={handleOpenForm} />

        <GuestForm
          guest={editingGuest}
          onSave={handleSaveGuest}
          onCancel={handleCloseForm}
          isOpen={isFormOpen}
        />
      </main>
    </div>
  );
}

export default App;