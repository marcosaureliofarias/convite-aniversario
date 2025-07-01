import { useState, useEffect } from 'react';
import { Guest, InvitationStats } from '../types';
import { guestAPI } from '../services/guestAPI';

export const useGuests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar convidados na inicialização
  useEffect(() => {
    const loadGuests = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedGuests = await guestAPI.getAll();
        setGuests(loadedGuests);
      } catch (err) {
        console.error('Erro ao carregar convidados:', err);
        setError('Erro ao carregar convidados. Verifique se o servidor está rodando.');
      } finally {
        setLoading(false);
      }
    };

    loadGuests();
  }, []);

  const addGuest = async (guestData: Omit<Guest, 'id' | 'invitedAt'>) => {
    try {
      setError(null);
      const newGuest = await guestAPI.create(guestData);
      setGuests(prev => [...prev, newGuest]);
      return newGuest;
    } catch (err) {
      console.error('Erro ao adicionar convidado:', err);
      setError('Erro ao adicionar convidado');
      throw err;
    }
  };

  const editGuest = async (id: string, updates: Partial<Guest>) => {
    try {
      setError(null);
      const updatedGuest = await guestAPI.update(id, updates);
      setGuests(prev => prev.map(g => g.id === id ? updatedGuest : g));
      return updatedGuest;
    } catch (err) {
      console.error('Erro ao editar convidado:', err);
      setError('Erro ao editar convidado');
      throw err;
    }
  };

  const removeGuest = async (id: string) => {
    try {
      setError(null);
      await guestAPI.delete(id);
      setGuests(prev => prev.filter(g => g.id !== id));
      return true;
    } catch (err) {
      console.error('Erro ao remover convidado:', err);
      setError('Erro ao remover convidado');
      throw err;
    }
  };

  const confirmGuestPresence = async (id: string) => {
    try {
      setError(null);
      const confirmedGuest = await guestAPI.confirm(id);
      setGuests(prev => prev.map(g => g.id === id ? confirmedGuest : g));
      return confirmedGuest;
    } catch (err) {
      console.error('Erro ao confirmar convidado:', err);
      setError('Erro ao confirmar convidado');
      throw err;
    }
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
    error,
    addGuest,
    editGuest,
    removeGuest,
    confirmGuestPresence,
    getStats,
    searchGuests
  };
};