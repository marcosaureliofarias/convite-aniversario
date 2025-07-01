import React, { useState, useMemo } from 'react';
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
  const { guests, loading, addGuest, editGuest, removeGuest, confirmGuestPresence, getStats } = useGuests();
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

  const handleSaveGuest = (guestData: Omit<Guest, 'id' | 'invitedAt'>) => {
    if (editingGuest) {
      editGuest(editingGuest.id, guestData);
    } else {
      addGuest(guestData);
    }
    handleCloseForm();
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setIsFormOpen(true);
  };

  const handleDeleteGuest = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este convidado?')) {
      removeGuest(id);
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