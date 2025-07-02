// Sistema de persistência real para arquivo JSON
import { Guest } from '../types';

// Gerenciador de dados local com persistência real
class LocalDataManager {
  private readonly DATA_KEY = 'birthday-guests-persistent';
  private guests: Guest[] = [];
  private initialized = false;

  // Inicializar dados
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Primeiro tenta carregar dados salvos no localStorage
      const saved = localStorage.getItem(this.DATA_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        this.guests = data.map((guest: any) => ({
          ...guest,
          invitedAt: new Date(guest.invitedAt),
          confirmedAt: guest.confirmedAt ? new Date(guest.confirmedAt) : undefined
        }));
      } else {
        // Se não há dados salvos, tenta carregar do arquivo inicial
        await this.loadInitialData();
      }
      
      this.initialized = true;
      console.log(`📁 Dados carregados: ${this.guests.length} convidados`);
    } catch (error) {
      console.error('Erro ao inicializar dados:', error);
      this.guests = [];
      this.initialized = true;
    }
  }

  // Carregar dados iniciais do arquivo
  private async loadInitialData(): Promise<void> {
    try {
      const response = await fetch('/data/guests.json');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          this.guests = data.map((guest: any) => ({
            ...guest,
            invitedAt: new Date(guest.invitedAt),
            confirmedAt: guest.confirmedAt ? new Date(guest.confirmedAt) : undefined
          }));
          // Salvar imediatamente no localStorage
          await this.persist();
        }
      }
    } catch (error) {
      console.warn('Arquivo inicial não encontrado, iniciando com dados vazios');
    }
  }

  // Persistir dados (salvar)
  private async persist(): Promise<void> {
    try {
      // Salvar no localStorage como persistência principal
      localStorage.setItem(this.DATA_KEY, JSON.stringify(this.guests));
      
      // Também criar um backup baixável automaticamente
      await this.createBackupFile();
      
      console.log(`💾 Dados salvos: ${this.guests.length} convidados`);
    } catch (error) {
      console.error('Erro ao persistir dados:', error);
      throw new Error('Erro ao salvar dados');
    }
  }

  // Criar arquivo de backup baixável
  private async createBackupFile(): Promise<void> {
    try {
      const stats = this.getStats();
      const dataToSave = {
        event: {
          name: "Aniversário do Marcos Farias",
          date: "15 de Julho de 2025",
          location: "Salão de Festas Premium"
        },
        stats,
        guests: this.guests,
        lastUpdated: new Date().toISOString()
      };

      // Criar blob para download
      const blob = new Blob([JSON.stringify(dataToSave, null, 2)], {
        type: 'application/json'
      });

      // Armazenar URL do blob para download manual quando necessário
      const url = URL.createObjectURL(blob);
      (window as any).guestDataBackupUrl = url;
      
      // Log para desenvolvimento
      console.log('📦 Backup criado e disponível para download');
    } catch (error) {
      console.warn('Erro ao criar backup:', error);
    }
  }

  // Obter estatísticas
  private getStats() {
    const total = this.guests.length;
    const confirmed = this.guests.filter(g => g.confirmed).length;
    const pending = total - confirmed;
    const confirmationRate = total > 0 ? (confirmed / total) * 100 : 0;
    return { total, confirmed, pending, confirmationRate };
  }

  // CRUD Operations

  async getAllGuests(): Promise<Guest[]> {
    await this.initialize();
    return [...this.guests];
  }

  async addGuest(guestData: Omit<Guest, 'id' | 'invitedAt'>): Promise<Guest> {
    await this.initialize();
    
    const newGuest: Guest = {
      ...guestData,
      id: crypto.randomUUID(),
      invitedAt: new Date()
    };

    this.guests.push(newGuest);
    await this.persist();
    
    return newGuest;
  }

  async updateGuest(id: string, updates: Partial<Guest>): Promise<Guest> {
    await this.initialize();
    
    const index = this.guests.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Convidado não encontrado');
    }

    this.guests[index] = { ...this.guests[index], ...updates };
    await this.persist();
    
    return this.guests[index];
  }

  async deleteGuest(id: string): Promise<void> {
    await this.initialize();
    
    const initialLength = this.guests.length;
    this.guests = this.guests.filter(g => g.id !== id);
    
    if (this.guests.length === initialLength) {
      throw new Error('Convidado não encontrado');
    }

    await this.persist();
  }

  async confirmGuest(id: string): Promise<Guest> {
    await this.initialize();
    
    const index = this.guests.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Convidado não encontrado');
    }

    this.guests[index] = {
      ...this.guests[index],
      confirmed: true,
      confirmedAt: new Date()
    };

    await this.persist();
    return this.guests[index];
  }

  async clearAll(): Promise<void> {
    await this.initialize();
    this.guests = [];
    await this.persist();
    
    // Limpar também backup URLs
    if ((window as any).guestDataBackupUrl) {
      URL.revokeObjectURL((window as any).guestDataBackupUrl);
      delete (window as any).guestDataBackupUrl;
    }
  }

  async importGuests(guests: Guest[]): Promise<number> {
    await this.initialize();
    
    const processedGuests = guests.map((guest: any) => ({
      ...guest,
      id: guest.id || crypto.randomUUID(),
      invitedAt: new Date(guest.invitedAt || new Date()),
      confirmedAt: guest.confirmedAt ? new Date(guest.confirmedAt) : undefined
    }));

    this.guests = processedGuests;
    await this.persist();
    
    return this.guests.length;
  }

  // Baixar backup atual
  async downloadBackup(): Promise<void> {
    await this.initialize();
    
    const stats = this.getStats();
    const dataToExport = {
      event: {
        name: "Aniversário do Marcos Farias",
        date: "15 de Julho de 2025",
        location: "Salão de Festas Premium"
      },
      stats,
      guests: this.guests,
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

  // Forçar recarregamento (útil para desenvolvimento)
  async forceReload(): Promise<Guest[]> {
    this.initialized = false;
    localStorage.removeItem(this.DATA_KEY);
    await this.initialize();
    return [...this.guests];
  }
}

// Instância singleton
export const localDataManager = new LocalDataManager();

// API compatível com a interface anterior
export const persistentGuestAPI = {
  async getAll(): Promise<Guest[]> {
    return await localDataManager.getAllGuests();
  },

  async create(guestData: Omit<Guest, 'id' | 'invitedAt'>): Promise<Guest> {
    return await localDataManager.addGuest(guestData);
  },

  async update(id: string, updates: Partial<Guest>): Promise<Guest> {
    return await localDataManager.updateGuest(id, updates);
  },

  async delete(id: string): Promise<void> {
    return await localDataManager.deleteGuest(id);
  },

  async confirm(id: string): Promise<Guest> {
    return await localDataManager.confirmGuest(id);
  },

  async clearAll(): Promise<void> {
    return await localDataManager.clearAll();
  },

  async importData(guests: Guest[]): Promise<number> {
    return await localDataManager.importGuests(guests);
  },

  async downloadBackup(): Promise<void> {
    return await localDataManager.downloadBackup();
  },

  async forceReload(): Promise<Guest[]> {
    return await localDataManager.forceReload();
  }
};
