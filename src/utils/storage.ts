import { Guest } from '../types';

const STORAGE_KEY = 'birthday-guests';

export const loadGuests = (): Guest[] => {
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
    console.error('Error loading guests:', error);
    return [];
  }
};

export const saveGuests = (guests: Guest[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
  } catch (error) {
    console.error('Error saving guests:', error);
  }
};

export const addGuest = (guest: Omit<Guest, 'id' | 'invitedAt'>): Guest => {
  const newGuest: Guest = {
    ...guest,
    id: crypto.randomUUID(),
    invitedAt: new Date()
  };
  
  const guests = loadGuests();
  guests.push(newGuest);
  saveGuests(guests);
  
  return newGuest;
};

export const updateGuest = (id: string, updates: Partial<Guest>): Guest | null => {
  const guests = loadGuests();
  const index = guests.findIndex(g => g.id === id);
  
  if (index === -1) return null;
  
  guests[index] = { ...guests[index], ...updates };
  saveGuests(guests);
  
  return guests[index];
};

export const deleteGuest = (id: string): boolean => {
  const guests = loadGuests();
  const filtered = guests.filter(g => g.id !== id);
  
  if (filtered.length === guests.length) return false;
  
  saveGuests(filtered);
  return true;
};

export const confirmGuest = (id: string): Guest | null => {
  return updateGuest(id, {
    confirmed: true,
    confirmedAt: new Date()
  });
};