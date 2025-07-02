// Utilitário para gerenciar dados dos convidados em arquivo JSON local
import { Guest } from '../types';

// Arquivo de dados local
const DATA_FILE = '/data/guests.json';

// Cache em memória para melhorar performance
let guestsCache: Guest[] | null = null;

// Função para carregar dados do arquivo JSON
const loadGuestsFromFile = async (): Promise<Guest[]> => {
  try {
    // Se já temos cache, usar o cache
    if (guestsCache !== null) {
      return guestsCache;
    }

    const response = await fetch(DATA_FILE);
    
    if (!response.ok) {
      // Se arquivo não existe, criar um vazio
      if (response.status === 404) {
        console.log('Arquivo de dados não encontrado, criando novo...');
        await saveGuestsToFile([]);
        return [];
      }
      throw new Error(`Erro ao carregar dados: ${response.status}`);
    }

    const data = await response.json();
    const guests = Array.isArray(data) ? data : [];
    
    // Processar datas
    const processedGuests = guests.map((guest: any) => ({
      ...guest,
      invitedAt: new Date(guest.invitedAt),
      confirmedAt: guest.confirmedAt ? new Date(guest.confirmedAt) : undefined
    }));

    // Atualizar cache
    guestsCache = processedGuests;
    
    return processedGuests;
  } catch (error) {
    console.error('Erro ao carregar convidados do arquivo:', error);
    
    // Fallback para localStorage como backup
    try {
      const backup = localStorage.getItem('birthday-guests-backup');
      if (backup) {
        const guests = JSON.parse(backup);
        return guests.map((guest: any) => ({
          ...guest,
          invitedAt: new Date(guest.invitedAt),
          confirmedAt: guest.confirmedAt ? new Date(guest.confirmedAt) : undefined
        }));
      }
    } catch (backupError) {
      console.error('Erro no backup do localStorage:', backupError);
    }
    
    return [];
  }
};

// Função para salvar dados no arquivo JSON
const saveGuestsToFile = async (guests: Guest[]): Promise<void> => {
  try {
    // Atualizar cache
    guestsCache = guests;
    
    // Backup no localStorage
    localStorage.setItem('birthday-guests-backup', JSON.stringify(guests));
    
    // Em um ambiente real, você enviaria para uma API
    // Por enquanto, vamos simular salvando no cache e localStorage
    console.log('Dados salvos localmente:', guests.length, 'convidados');
    
    // Para desenvolvimento, também podemos baixar o arquivo atualizado
    // Em produção, isso seria enviado para um servidor/API
    
  } catch (error) {
    console.error('Erro ao salvar convidados:', error);
    throw new Error('Erro ao salvar dados');
  }
};

// Função para limpar cache
const clearCache = (): void => {
  guestsCache = null;
};

// API principal para gerenciar convidados
export const fileBasedGuestAPI = {
  // Buscar todos os convidados
  async getAll(): Promise<Guest[]> {
    return await loadGuestsFromFile();
  },

  // Adicionar novo convidado
  async create(guestData: Omit<Guest, 'id' | 'invitedAt'>): Promise<Guest> {
    try {
      const guests = await loadGuestsFromFile();
      const newGuest: Guest = {
        ...guestData,
        id: crypto.randomUUID(),
        invitedAt: new Date()
      };
      
      const updatedGuests = [...guests, newGuest];
      await saveGuestsToFile(updatedGuests);
      
      return newGuest;
    } catch (error) {
      console.error('Erro ao criar convidado:', error);
      throw error;
    }
  },

  // Atualizar convidado
  async update(id: string, updates: Partial<Guest>): Promise<Guest> {
    try {
      const guests = await loadGuestsFromFile();
      const index = guests.findIndex(g => g.id === id);
      
      if (index === -1) {
        throw new Error('Convidado não encontrado');
      }
      
      guests[index] = { ...guests[index], ...updates };
      await saveGuestsToFile(guests);
      
      return guests[index];
    } catch (error) {
      console.error('Erro ao atualizar convidado:', error);
      throw error;
    }
  },

  // Remover convidado
  async delete(id: string): Promise<void> {
    try {
      const guests = await loadGuestsFromFile();
      const filteredGuests = guests.filter(g => g.id !== id);
      
      if (filteredGuests.length === guests.length) {
        throw new Error('Convidado não encontrado');
      }
      
      await saveGuestsToFile(filteredGuests);
    } catch (error) {
      console.error('Erro ao remover convidado:', error);
      throw error;
    }
  },

  // Confirmar presença
  async confirm(id: string): Promise<Guest> {
    try {
      const guests = await loadGuestsFromFile();
      const index = guests.findIndex(g => g.id === id);
      
      if (index === -1) {
        throw new Error('Convidado não encontrado');
      }
      
      guests[index] = {
        ...guests[index],
        confirmed: true,
        confirmedAt: new Date()
      };
      
      await saveGuestsToFile(guests);
      return guests[index];
    } catch (error) {
      console.error('Erro ao confirmar convidado:', error);
      throw error;
    }
  },

  // Limpar todos os dados
  async clearAll(): Promise<void> {
    try {
      await saveGuestsToFile([]);
      clearCache();
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      throw error;
    }
  },

  // Importar dados de arquivo
  async importFromFile(data: Guest[]): Promise<number> {
    try {
      const processedGuests = data.map((guest: any) => ({
        ...guest,
        id: guest.id || crypto.randomUUID(),
        invitedAt: new Date(guest.invitedAt || new Date()),
        confirmedAt: guest.confirmedAt ? new Date(guest.confirmedAt) : undefined
      }));
      
      await saveGuestsToFile(processedGuests);
      return processedGuests.length;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      throw error;
    }
  },

  // Força recarregar do arquivo
  async forceReload(): Promise<Guest[]> {
    clearCache();
    return await loadGuestsFromFile();
  }
};

// Função utilitária para baixar o arquivo de dados atual
export const downloadCurrentData = async (): Promise<void> => {
  try {
    const guests = await fileBasedGuestAPI.getAll();
    const stats = {
      total: guests.length,
      confirmed: guests.filter(g => g.confirmed).length,
      pending: guests.filter(g => !g.confirmed).length
    };

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
        notes: guest.notes,
        id: guest.id
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
  } catch (error) {
    console.error('Erro ao baixar dados:', error);
    throw error;
  }
};
