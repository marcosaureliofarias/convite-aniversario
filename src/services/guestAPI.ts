import { Guest } from '../types';
import { persistentGuestAPI } from './persistentGuestAPI';

// Simula delay de rede para manter a experiência de API
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const guestAPI = {
  // Buscar todos os convidados
  async getAll(): Promise<Guest[]> {
    await delay();
    try {
      return await persistentGuestAPI.getAll();
    } catch (error) {
      console.error('Erro ao buscar convidados:', error);
      throw error;
    }
  },

  // Adicionar novo convidado
  async create(guestData: Omit<Guest, 'id' | 'invitedAt'>): Promise<Guest> {
    await delay();
    try {
      const newGuest = await persistentGuestAPI.create(guestData);
      console.log('✅ Convidado adicionado e salvo:', newGuest.name);
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
      const updatedGuest = await persistentGuestAPI.update(id, updates);
      console.log('✅ Convidado atualizado e salvo:', updatedGuest.name);
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
      await persistentGuestAPI.delete(id);
      console.log('✅ Convidado removido e salvo');
    } catch (error) {
      console.error('Erro ao remover convidado:', error);
      throw error;
    }
  },

  // Confirmar presença
  async confirm(id: string): Promise<Guest> {
    await delay();
    try {
      const confirmedGuest = await persistentGuestAPI.confirm(id);
      console.log('✅ Presença confirmada e salva:', confirmedGuest.name);
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
      await persistentGuestAPI.clearAll();
      console.log('✅ Todos os dados foram limpos e salvos');
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      throw error;
    }
  },

  // Importar dados
  async importData(data: Guest[]): Promise<number> {
    await delay();
    try {
      const count = await persistentGuestAPI.importData(data);
      console.log(`✅ ${count} convidados importados e salvos`);
      return count;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      throw error;
    }
  },

  // Baixar backup
  async downloadBackup(): Promise<void> {
    try {
      await persistentGuestAPI.downloadBackup();
      console.log('✅ Backup baixado com sucesso');
    } catch (error) {
      console.error('Erro ao baixar backup:', error);
      throw error;
    }
  },

  // Forçar recarregamento
  async forceReload(): Promise<Guest[]> {
    try {
      const guests = await persistentGuestAPI.forceReload();
      console.log('✅ Dados recarregados:', guests.length, 'convidados');
      return guests;
    } catch (error) {
      console.error('Erro ao recarregar dados:', error);
      throw error;
    }
  }
};
