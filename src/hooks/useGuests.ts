import { useState, useEffect } from 'react';
import { Guest, InvitationStats } from '../types';
import { guestAPI } from '../services/guestAPI';
import { downloadCurrentData } from '../services/fileBasedGuestAPI';

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
        setError('Erro ao carregar convidados do armazenamento local.');
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

  // Função para exportar dados dos convidados
  const exportGuestData = async () => {
    try {
      await downloadCurrentData();
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      // Fallback para o método anterior
      const stats = getStats();
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

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `convidados-aniversario-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    }
  };

  // Função para importar dados dos convidados
  const importGuestData = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.guests && Array.isArray(data.guests)) {
        const importedCount = await guestAPI.importData(data.guests);
        
        // Recarregar dados
        const updatedGuests = await guestAPI.getAll();
        setGuests(updatedGuests);
        
        return importedCount;
      } else {
        throw new Error('Formato de arquivo inválido');
      }
    } catch (err) {
      console.error('Erro ao importar dados:', err);
      setError('Erro ao importar dados. Verifique o formato do arquivo.');
      throw err;
    }
  };

  // Função para limpar todos os dados
  const clearAllData = async () => {
    try {
      await guestAPI.clearAll();
      setGuests([]);
      setError(null);
    } catch (err) {
      console.error('Erro ao limpar dados:', err);
      setError('Erro ao limpar dados');
      throw err;
    }
  };

  // Função para forçar recarregar dados do arquivo
  const forceReload = async () => {
    try {
      setLoading(true);
      setError(null);
      const reloadedGuests = await guestAPI.getAll();
      setGuests(reloadedGuests);
    } catch (err) {
      console.error('Erro ao recarregar dados:', err);
      setError('Erro ao recarregar dados do arquivo');
      throw err;
    } finally {
      setLoading(false);
    }
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
    searchGuests,
    exportGuestData,
    importGuestData,
    clearAllData,
    forceReload
  };
};