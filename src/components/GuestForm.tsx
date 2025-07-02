import React, { useState, useEffect } from 'react';
import { Guest } from '../types';
import { X, UserPlus, Save } from 'lucide-react';

interface GuestFormProps {
  guest?: Guest;
  onSave: (guestData: Omit<Guest, 'id' | 'invitedAt'>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const GuestForm: React.FC<GuestFormProps> = ({ 
  guest, 
  onSave, 
  onCancel, 
  isOpen 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    confirmed: false
  });

  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name,
        phone: guest.phone,
        email: guest.email || '',
        notes: guest.notes || '',
        confirmed: guest.confirmed
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        notes: '',
        confirmed: false
      });
    }
  }, [guest, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    onSave({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      confirmed: formData.confirmed,
      confirmedAt: formData.confirmed ? new Date() : undefined
    });
  };

  const formatPhoneInput = (value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length <= 2) return clean;
    if (clean.length <= 7) return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {guest ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {guest ? 'Editar Convidado' : 'Novo Convidado'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Nome do convidado"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="(21) 98531-7129"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              placeholder="Observações sobre o convidado..."
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="confirmed"
              checked={formData.confirmed}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmed: e.target.checked }))}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="confirmed" className="ml-2 text-sm text-gray-700">
              Já confirmou presença
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
            >
              {guest ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};