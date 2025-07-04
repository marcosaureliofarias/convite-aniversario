import { Guest } from '../types';

// Base URL para as APIs
const API_BASE = '/api';

// Utilitário para fazer requisições
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(error.error || `Erro ${response.status}`);
  }

  return response.json();
}

export const mongoGuestAPI = {
  // Buscar todos os convidados
  async getAll(): Promise<Guest[]> {
    try {
      const guests = await apiRequest('/guests');
      return guests.map((guest: any) => ({
        ...guest,
        invitedAt: new Date(guest.invitedAt),
        confirmedAt: guest.confirmedAt ? new Date(guest.confirmedAt) : undefined
      }));
    } catch (error) {
      console.error('Erro ao buscar convidados:', error);
      throw error;
    }
  },

  // Criar novo convidado
  async create(guestData: Omit<Guest, 'id' | 'invitedAt'>): Promise<Guest> {
    try {
      const newGuest = await apiRequest('/guests', {
        method: 'POST',
        body: JSON.stringify(guestData),
      });

      return {
        ...newGuest,
        invitedAt: new Date(newGuest.invitedAt),
        confirmedAt: newGuest.confirmedAt ? new Date(newGuest.confirmedAt) : undefined
      };
    } catch (error) {
      console.error('Erro ao criar convidado:', error);
      throw error;
    }
  },

  // Atualizar convidado
  async update(id: string, updates: Partial<Guest>): Promise<Guest> {
    try {
      const updatedGuest = await apiRequest(`/guests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      return {
        ...updatedGuest,
        invitedAt: new Date(updatedGuest.invitedAt),
        confirmedAt: updatedGuest.confirmedAt ? new Date(updatedGuest.confirmedAt) : undefined
      };
    } catch (error) {
      console.error('Erro ao atualizar convidado:', error);
      throw error;
    }
  },

  // Remover convidado
  async delete(id: string): Promise<void> {
    try {
      await apiRequest(`/guests/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Erro ao remover convidado:', error);
      throw error;
    }
  },

  // Confirmar presença
  async confirm(id: string): Promise<Guest> {
    try {
      const confirmedGuest = await apiRequest(`/guests/${id}/confirm`, {
        method: 'POST',
      });

      return {
        ...confirmedGuest,
        invitedAt: new Date(confirmedGuest.invitedAt),
        confirmedAt: new Date(confirmedGuest.confirmedAt)
      };
    } catch (error) {
      console.error('Erro ao confirmar convidado:', error);
      throw error;
    }
  },

  // Limpar todos os dados
  async clearAll(): Promise<void> {
    try {
      await apiRequest('/guests', {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      throw error;
    }
  },

  // Importar dados
  async importData(guests: Guest[]): Promise<number> {
    try {
      // Primeiro limpar dados existentes
      await this.clearAll();
      
      // Inserir novos dados um por um
      let importedCount = 0;
      for (const guest of guests) {
        try {
          await this.create({
            name: guest.name,
            phone: guest.phone,
            email: guest.email,
            notes: guest.notes,
            confirmed: guest.confirmed,
            confirmedAt: guest.confirmedAt
          });
          importedCount++;
        } catch (error) {
          console.warn('Erro ao importar convidado:', guest.name, error);
        }
      }
      
      return importedCount;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      throw error;
    }
  },

  // Baixar backup
  async downloadBackup(): Promise<void> {
    try {
      const guests = await this.getAll();
      
      const stats = {
        total: guests.length,
        confirmed: guests.filter(g => g.confirmed).length,
        pending: guests.filter(g => !g.confirmed).length,
        confirmationRate: guests.length > 0 ? (guests.filter(g => g.confirmed).length / guests.length) * 100 : 0
      };

      const dataToExport = {
        event: {
          name: "Aniversário do Marcos Farias",
          date: "15 de Julho de 2025",
          location: "Salão de Festas Premium"
        },
        stats,
        guests,
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
    } catch (error) {
      console.error('Erro ao baixar backup:', error);
      throw error;
    }
  },

  // Forçar recarregamento
  async forceReload(): Promise<Guest[]> {
    try {
      return await this.getAll();
    } catch (error) {
      console.error('Erro ao recarregar dados:', error);
      throw error;
    }
  }
};
