import { Guest } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// Função auxiliar para tratar respostas da API
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(error.error || 'Erro na requisição');
  }
  
  // Para DELETE requests, não há conteúdo para parsear
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

// Função para converter strings de data de volta para objetos Date
const parseGuestDates = (guest: any): Guest => ({
  ...guest,
  invitedAt: new Date(guest.invitedAt),
  confirmedAt: guest.confirmedAt ? new Date(guest.confirmedAt) : undefined
});

export const guestAPI = {
  // Buscar todos os convidados
  async getAll(): Promise<Guest[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/guests`);
      const guests = await handleResponse(response);
      return guests.map(parseGuestDates);
    } catch (error) {
      console.error('Erro ao buscar convidados:', error);
      throw error;
    }
  },

  // Adicionar novo convidado
  async create(guestData: Omit<Guest, 'id' | 'invitedAt'>): Promise<Guest> {
    try {
      const response = await fetch(`${API_BASE_URL}/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guestData),
      });
      const guest = await handleResponse(response);
      return parseGuestDates(guest);
    } catch (error) {
      console.error('Erro ao criar convidado:', error);
      throw error;
    }
  },

  // Atualizar convidado
  async update(id: string, updates: Partial<Guest>): Promise<Guest> {
    try {
      const response = await fetch(`${API_BASE_URL}/guests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      const guest = await handleResponse(response);
      return parseGuestDates(guest);
    } catch (error) {
      console.error('Erro ao atualizar convidado:', error);
      throw error;
    }
  },

  // Remover convidado
  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/guests/${id}`, {
        method: 'DELETE',
      });
      await handleResponse(response);
    } catch (error) {
      console.error('Erro ao remover convidado:', error);
      throw error;
    }
  },

  // Confirmar presença
  async confirm(id: string): Promise<Guest> {
    try {
      const response = await fetch(`${API_BASE_URL}/guests/${id}/confirm`, {
        method: 'PUT',
      });
      const guest = await handleResponse(response);
      return parseGuestDates(guest);
    } catch (error) {
      console.error('Erro ao confirmar convidado:', error);
      throw error;
    }
  }
};
