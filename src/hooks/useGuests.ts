import { useState, useEffect } from 'react';
import { Guest, InvitationStats } from '../types';
import { loadGuests, saveGuests, addGuest as addGuestToStorage, updateGuest, deleteGuest, confirmGuest } from '../utils/storage';

export const useGuests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedGuests = loadGuests();
    setGuests(loadedGuests);
    setLoading(false);
  }, []);

  const addGuest = (guestData: Omit<Guest, 'id' | 'invitedAt'>) => {
    const newGuest = addGuestToStorage(guestData);
    setGuests(prev => [...prev, newGuest]);
    return newGuest;
  };

  const editGuest = (id: string, updates: Partial<Guest>) => {
    const updatedGuest = updateGuest(id, updates);
    if (updatedGuest) {
      setGuests(prev => prev.map(g => g.id === id ? updatedGuest : g));
    }
    return updatedGuest;
  };

  const removeGuest = (id: string) => {
    const success = deleteGuest(id);
    if (success) {
      setGuests(prev => prev.filter(g => g.id !== id));
    }
    return success;
  };

  const confirmGuestPresence = (id: string) => {
    const confirmedGuest = confirmGuest(id);
    if (confirmedGuest) {
      setGuests(prev => prev.map(g => g.id === id ? confirmedGuest : g));
    }
    return confirmedGuest;
  };

  const getStats = (): InvitationStats => {
    const total = guests.length;
    const confirmed = guests.filter(g => g.confirmed).length;
    const pending = total - confirmed;
    const confirmationRate = total > 0 ? (confirmed / total) * 100 : 0;

    return { total, confirmed, pending, confirmationRate };
  };

  const searchGuests = (query: string): Guest[] => {
    if (!query.trim()) return guests;
    
    const lowercaseQuery = query.toLowerCase();
    return guests.filter(guest => 
      guest.name.toLowerCase().includes(lowercaseQuery) ||
      guest.phone.includes(query) ||
      guest.email?.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    guests,
    loading,
    addGuest,
    editGuest,
    removeGuest,
    confirmGuestPresence,
    getStats,
    searchGuests
  };
};