export interface Guest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  confirmed: boolean;
  confirmedAt?: Date;
  invitedAt: Date;
  notes?: string;
}

export interface InvitationStats {
  total: number;
  confirmed: number;
  pending: number;
  confirmationRate: number;
}