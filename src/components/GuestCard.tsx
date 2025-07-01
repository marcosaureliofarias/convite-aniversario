import React from 'react';
import { Guest } from '../types';
import { Phone, Mail, Check, X, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { formatPhoneNumber, generateWhatsAppLink } from '../utils/whatsapp';

interface GuestCardProps {
  guest: Guest;
  onConfirm: (id: string) => void;
  onEdit: (guest: Guest) => void;
  onDelete: (id: string) => void;
  hostPhone: string;
}

export const GuestCard: React.FC<GuestCardProps> = ({ 
  guest, 
  onConfirm, 
  onEdit, 
  onDelete, 
  hostPhone 
}) => {
  const handleWhatsAppConfirm = () => {
    const whatsappLink = generateWhatsAppLink(hostPhone, guest.name);
    window.open(whatsappLink, '_blank');
    onConfirm(guest.id);
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:shadow-lg animate-fade-in border-l-4 ${
      guest.confirmed ? 'border-accent-500' : 'border-gray-300'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg">{guest.name}</h3>
          <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
            <Phone className="w-4 h-4" />
            <span>{formatPhoneNumber(guest.phone)}</span>
          </div>
          {guest.email && (
            <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
              <Mail className="w-4 h-4" />
              <span className="truncate">{guest.email}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {guest.confirmed ? (
            <div className="flex items-center gap-1 text-accent-600 bg-accent-50 px-2 py-1 rounded-full">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Confirmado</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-secondary-600 bg-secondary-50 px-2 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Pendente</span>
            </div>
          )}
        </div>
      </div>

      {guest.notes && (
        <p className="text-gray-600 text-sm mb-3 italic">{guest.notes}</p>
      )}

      <div className="flex gap-2">
        {!guest.confirmed && (
          <button
            onClick={handleWhatsAppConfirm}
            className="flex-1 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Confirmar via WhatsApp
          </button>
        )}
        
        <button
          onClick={() => onEdit(guest)}
          className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
        >
          <Edit className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onDelete(guest.id)}
          className="px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {guest.confirmed && guest.confirmedAt && (
        <p className="text-xs text-gray-500 mt-2">
          Confirmado em {guest.confirmedAt.toLocaleDateString('pt-BR')} às {guest.confirmedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  );
};