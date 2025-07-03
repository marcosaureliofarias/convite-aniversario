// Sistema de persistência REAL com servidor backend
import { Guest } from '../types';

// Configuração do servidor
const SERVER_URL = 'http://localhost:3001';
const STORAGE_KEY = 'birthday-guests-backup';

// Verificar se o servidor está disponível
const isServerAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${SERVER_URL}/api/guests`);
    return response.ok;
  } catch {
    return false;
  }
};

// Sistema híbrido: servidor primeiro, localStorage como fallback
class RealPersistentAPI {
  private useServer = true;
  
  // Verificar disponibilidade do servidor na inicialização
  private async checkServerAvailability(): Promise<void> {
    this.useServer = await isServerAvailable();
    if (!this.useServer) {
      console.warn('🔄 Servidor não disponível, usando modo local (localStorage)');
    } else {
      console.log('✅ Servidor conectado! Dados serão persistidos no arquivo real.');
    }
  }

  // Carregar dados (servidor ou localStorage)
  async getAll(): Promise<Guest[]> {
    await this.checkServerAvailability();
    
    if (this.useServer) {
      try {
        const response = await fetch(`${SERVER_URL}/api/guests`);
        if (response.ok) {
          const data = await response.json();
          // Salvar backup no localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          return this.processGuestData(data);
        }
      } catch (error) {
        console.error('Erro ao carregar do servidor:', error);
        this.useServer = false;
      }
    }
    
    // Fallback para localStorage
    return this.getFromLocalStorage();
  }

  // Adicionar convidado
  async create(guestData: Omit<Guest, 'id' | 'invitedAt'>): Promise<Guest> {
    await this.checkServerAvailability();
    
    if (this.useServer) {
      try {
        const response = await fetch(`${SERVER_URL}/api/guests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(guestData)
        });
        
        if (response.ok) {
          const newGuest = await response.json();
          await this.syncToLocalStorage(); // Sincronizar com localStorage
          console.log('✅ Convidado salvo no arquivo real:', newGuest.name);
          return this.processGuestItem(newGuest);
        }
      } catch (error) {
        console.error('Erro ao salvar no servidor:', error);
        this.useServer = false;
      }
    }
    
    // Fallback para localStorage
    return this.createInLocalStorage(guestData);
  }

  // Atualizar convidado
  async update(id: string, updates: Partial<Guest>): Promise<Guest> {
    await this.checkServerAvailability();
    
    if (this.useServer) {
      try {
        const response = await fetch(`${SERVER_URL}/api/guests/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        
        if (response.ok) {
          const updatedGuest = await response.json();
          await this.syncToLocalStorage();
          console.log('✅ Convidado atualizado no arquivo real:', updatedGuest.name);
          return this.processGuestItem(updatedGuest);
        }
      } catch (error) {
        console.error('Erro ao atualizar no servidor:', error);
        this.useServer = false;
      }
    }
    
    // Fallback para localStorage
    return this.updateInLocalStorage(id, updates);
  }

  // Remover convidado
  async delete(id: string): Promise<void> {
    await this.checkServerAvailability();
    
    if (this.useServer) {
      try {
        const response = await fetch(`${SERVER_URL}/api/guests/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await this.syncToLocalStorage();
          console.log('✅ Convidado removido do arquivo real');
          return;
        }
      } catch (error) {
        console.error('Erro ao remover do servidor:', error);
        this.useServer = false;
      }
    }
    
    // Fallback para localStorage
    return this.deleteFromLocalStorage(id);
  }

  // Confirmar presença
  async confirm(id: string): Promise<Guest> {
    await this.checkServerAvailability();
    
    if (this.useServer) {
      try {
        const response = await fetch(`${SERVER_URL}/api/guests/${id}/confirm`, {
          method: 'PUT'
        });
        
        if (response.ok) {
          const confirmedGuest = await response.json();
          await this.syncToLocalStorage();
          console.log('✅ Presença confirmada no arquivo real:', confirmedGuest.name);
          return this.processGuestItem(confirmedGuest);
        }
      } catch (error) {
        console.error('Erro ao confirmar no servidor:', error);
        this.useServer = false;
      }
    }
    
    // Fallback para localStorage
    return this.confirmInLocalStorage(id);
  }

  // Limpar todos os dados
  async clearAll(): Promise<void> {
    await this.checkServerAvailability();
    
    if (this.useServer) {
      try {
        // Buscar todos e deletar um por um (ou implementar clear endpoint)
        const guests = await this.getAll();
        for (const guest of guests) {
          await this.delete(guest.id);
        }
        console.log('✅ Todos os dados limpos do arquivo real');
        return;
      } catch (error) {
        console.error('Erro ao limpar dados do servidor:', error);
        this.useServer = false;
      }
    }
    
    // Fallback para localStorage
    localStorage.removeItem(STORAGE_KEY);
  }

  // Importar dados
  async importData(guests: Guest[]): Promise<number> {
    await this.checkServerAvailability();
    
    if (this.useServer) {
      try {
        // Limpar dados existentes
        await this.clearAll();
        
        // Adicionar novos dados
        let count = 0;
        for (const guest of guests) {
          await this.create(guest);
          count++;
        }
        
        console.log(`✅ ${count} convidados importados para o arquivo real`);
        return count;
      } catch (error) {
        console.error('Erro ao importar para servidor:', error);
        this.useServer = false;
      }
    }
    
    // Fallback para localStorage
    const processedGuests = guests.map(guest => ({
      ...guest,
      id: guest.id || crypto.randomUUID(),
      invitedAt: new Date(guest.invitedAt || new Date()),
      confirmedAt: guest.confirmedAt ? new Date(guest.confirmedAt) : undefined
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(processedGuests));
    return processedGuests.length;
  }

  // Baixar backup atual
  async downloadBackup(): Promise<void> {
    const guests = await this.getAll();
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
      guests,
      exportedAt: new Date().toISOString(),
      source: this.useServer ? 'server' : 'localStorage'
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

  // Forçar recarregamento
  async forceReload(): Promise<Guest[]> {
    this.useServer = true; // Reset para tentar servidor novamente
    const guests = await this.getAll();
    return guests;
  }

  // === MÉTODOS AUXILIARES ===

  // Processar dados de convidados (converter strings de data)
  private processGuestData(data: any[]): Guest[] {
    return data.map(guest => this.processGuestItem(guest));
  }

  private processGuestItem(guest: any): Guest {
    return {
      ...guest,
      invitedAt: new Date(guest.invitedAt),
      confirmedAt: guest.confirmedAt ? new Date(guest.confirmedAt) : undefined
    };
  }

  // Sincronizar servidor com localStorage
  private async syncToLocalStorage(): Promise<void> {
    try {
      const guests = await this.getAll();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    } catch (error) {
      console.warn('Erro ao sincronizar com localStorage:', error);
    }
  }

  // Carregar de localStorage
  private getFromLocalStorage(): Guest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const guests = JSON.parse(data);
        return this.processGuestData(guests);
      }
    } catch (error) {
      console.error('Erro ao carregar localStorage:', error);
    }
    return [];
  }

  // Criar no localStorage
  private createInLocalStorage(guestData: Omit<Guest, 'id' | 'invitedAt'>): Guest {
    const guests = this.getFromLocalStorage();
    const newGuest: Guest = {
      ...guestData,
      id: crypto.randomUUID(),
      invitedAt: new Date()
    };
    
    guests.push(newGuest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    return newGuest;
  }

  // Atualizar no localStorage
  private updateInLocalStorage(id: string, updates: Partial<Guest>): Guest {
    const guests = this.getFromLocalStorage();
    const index = guests.findIndex(g => g.id === id);
    
    if (index === -1) {
      throw new Error('Convidado não encontrado');
    }
    
    guests[index] = { ...guests[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    return guests[index];
  }

  // Deletar do localStorage
  private deleteFromLocalStorage(id: string): void {
    const guests = this.getFromLocalStorage();
    const filteredGuests = guests.filter(g => g.id !== id);
    
    if (filteredGuests.length === guests.length) {
      throw new Error('Convidado não encontrado');
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredGuests));
  }

  // Confirmar no localStorage
  private confirmInLocalStorage(id: string): Guest {
    const guests = this.getFromLocalStorage();
    const index = guests.findIndex(g => g.id === id);
    
    if (index === -1) {
      throw new Error('Convidado não encontrado');
    }
    
    guests[index] = {
      ...guests[index],
      confirmed: true,
      confirmedAt: new Date()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    return guests[index];
  }
}

// Instância singleton
export const realPersistentAPI = new RealPersistentAPI();
