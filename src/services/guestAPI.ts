import { Guest } from '../types';
import { fileBasedGuestAPI } from './fileBasedGuestAPI';

// Simula delay de rede para manter a experiência de API
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback para localStorage como backup de emergência
const STORAGE_KEY = 'birthday-guests-backup';

// Função de backup para localStorage
const backupToLocalStorage = (guests: Guest[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
  } catch (error) {
    console.warn('Erro ao fazer backup no localStorage:', error);
  }
};

// Função para carregar backup do localStorage
const loadFromLocalStorageBackup = (): Guest[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const guests = JSON.parse(stored);
    return guests.map((guest: any) => ({
      ...guest,
      invitedAt: new Date(guest.invitedAt),
      confirmedAt: guest.confirmedAt ? new Date(guest.confirmedAt) : undefined
    }));
  } catch (error) {
    console.error('Erro ao carregar backup do localStorage:', error);
    return [];
  }
};

export const guestAPI = {
  // Buscar todos os convidados
  async getAll(): Promise<Guest[]> {
    await delay();
    try {
      const guests = await fileBasedGuestAPI.getAll();
      backupToLocalStorage(guests);
      return guests;
    } catch (error) {
      console.error('Erro ao buscar convidados do arquivo, usando backup:', error);
      return loadFromLocalStorageBackup();
    }
  },

  // Adicionar novo convidado
  async create(guestData: Omit<Guest, 'id' | 'invitedAt'>): Promise<Guest> {
    await delay();
    try {
      const newGuest = await fileBasedGuestAPI.create(guestData);
      return newGuest;
    } catch (error) {
      console.error('Erro ao criar convidado:', error);
      throw error;
    }
  },

  // Atualizar convidado
  async update(id: string, updates: Partial<Guest>): Promise<Guest> {
    await delay();
    try {
      const updatedGuest = await fileBasedGuestAPI.update(id, updates);
      return updatedGuest;
    } catch (error) {
      console.error('Erro ao atualizar convidado:', error);
      throw error;
    }
  },

  // Remover convidado
  async delete(id: string): Promise<void> {
    await delay();
    try {
      await fileBasedGuestAPI.delete(id);
    } catch (error) {
      console.error('Erro ao remover convidado:', error);
      throw error;
    }
  },

  // Confirmar presença
  async confirm(id: string): Promise<Guest> {
    await delay();
    try {
      const confirmedGuest = await fileBasedGuestAPI.confirm(id);
      return confirmedGuest;
    } catch (error) {
      console.error('Erro ao confirmar convidado:', error);
      throw error;
    }
  },

  // Limpar todos os dados
  async clearAll(): Promise<void> {
    await delay();
    try {
      await fileBasedGuestAPI.clearAll();
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      throw error;
    }
  },

  // Importar dados
  async importData(data: Guest[]): Promise<number> {
    await delay();
    try {
      return await fileBasedGuestAPI.importFromFile(data);
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      throw error;
    }
  }
};
