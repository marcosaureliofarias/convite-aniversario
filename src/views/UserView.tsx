import React, { useState } from 'react';
import { User, Calendar, MapPin, Clock, MessageCircle, Heart, Gift } from 'lucide-react';
import { useGuests } from '../hooks/useGuests';

// Your WhatsApp number for confirmations (replace with your actual number)
const HOST_PHONE = '5521985317129'; // Format: 55 + area code + number

export const UserView: React.FC = () => {
  const { guests, getStats, addGuest } = useGuests();
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [newGuestData, setNewGuestData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    confirmed: false
  });

  const stats = getStats();
  const confirmedGuests = guests.filter(guest => guest.confirmed);

  const handleSubmitGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestData.name.trim() || !newGuestData.phone.trim()) return;

    try {
      await addGuest({
        name: newGuestData.name.trim(),
        phone: newGuestData.phone.trim(),
        email: newGuestData.email.trim() || undefined,
        notes: newGuestData.notes.trim() || undefined,
        confirmed: newGuestData.confirmed,
        confirmedAt: newGuestData.confirmed ? new Date() : undefined
      });
      
      const message = newGuestData.confirmed 
        ? '🎉 Você foi adicionado à lista e sua presença foi confirmada!'
        : '✅ Você foi adicionado à lista! Confirme sua presença via WhatsApp quando quiser.';
      
      alert(message);
      resetForm();
      setShowGuestForm(false);
    } catch (error) {
      console.error('Erro ao adicionar convidado:', error);
      alert('Erro ao adicionar à lista. Tente novamente.');
    }
  };

  const formatPhoneInput = (value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length <= 2) return clean;
    if (clean.length <= 7) return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setNewGuestData(prev => ({ ...prev, phone: formatted }));
  };

  const resetForm = () => {
    setNewGuestData({ name: '', phone: '', email: '', notes: '', confirmed: false });
  };

  const handleCloseForm = () => {
    resetForm();
    setShowGuestForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-6 animate-bounce-subtle">
              <Heart className="w-12 h-12" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              🎂 Aniversário do Marcos & Matheus
            </h1>
            <p className="text-2xl text-purple-100 mb-2">
              Venha celebrar conosco este momento especial!
            </p>
            <p className="text-lg text-purple-200">
              Uma festa inesquecível aguarda por você
            </p>
          </div>

          {/* Event Details Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quando</h3>
                <p className="text-purple-100 text-lg font-medium">Sábado, 02 de agosto de 2025</p>
                <p className="text-purple-200">14:00 às 23:00</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Onde</h3>
                <p className="text-purple-100 text-lg font-medium">Saquarema</p>
                <p className="text-purple-200">Rua Espírito Santo, LT 05 QD 24 Vila do Abraão</p>
              </div>
            </div>
          </div>

          {/* Party Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-sm text-purple-200">Convidados</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold text-green-300">{stats.confirmed}</div>
              <div className="text-sm text-purple-200">Confirmados</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold text-yellow-300">{stats.pending}</div>
              <div className="text-sm text-purple-200">Pendentes</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold">{Math.round(stats.confirmationRate)}%</div>
              <div className="text-sm text-purple-200">Confirmação</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Call to Action */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🎉 Confirme sua Presença!
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            Sua presença é o melhor presente que podemos receber
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Escolha como quer confirmar: direto no formulário ou via WhatsApp
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-3xl mx-auto">
            <button
              onClick={() => setShowGuestForm(true)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <User className="w-6 h-6 inline mr-3" />
              Adicionar à Lista
              <div className="text-sm font-normal opacity-90 mt-1">
                Com opção de confirmar agora
              </div>
            </button>
            
            <a
              href={`https://wa.me/${HOST_PHONE}?text=${encodeURIComponent('Olá! Gostaria de confirmar minha presença no aniversário do Marcos! 🎉')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-center"
            >
              <MessageCircle className="w-6 h-6 inline mr-3" />
              Confirmar via WhatsApp
              <div className="text-sm font-normal opacity-90 mt-1">
                Conversa direta com organizador
              </div>
            </a>
          </div>
        </div>

        {/* Event Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-purple-500">
            <Gift className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Música e Diversão</h3>
            <p className="text-gray-600">DJ profissional com as melhores músicas para dançar a noite toda</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-pink-500">
            <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Comida Deliciosa</h3>
            <p className="text-gray-600">Buffet completo com pratos especiais e o famoso bolo de aniversário</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-indigo-500">
            <Clock className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Momentos Únicos</h3>
            <p className="text-gray-600">Uma noite especial para celebrar mais um ano de vida do Marcos</p>
          </div>
        </div>

        {/* Confirmed Guests List */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              🌟 Quem já confirmou presença
            </h2>
            <p className="text-gray-600">
              Veja quem já garantiu sua vaga nesta festa especial
            </p>
          </div>
          
          {confirmedGuests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎈</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Seja o primeiro a confirmar!
              </h3>
              <p className="text-gray-500">
                Sua confirmação é muito importante para nós
              </p>
            </div>
          ) : (
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {confirmedGuests.map((guest, index) => (
                <div key={guest.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {guest.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">{guest.name}</h3>
                    {guest.notes && (
                      <p className="text-sm text-gray-600 italic">{guest.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-medium">#{index + 1}</span>
                    <div className="text-green-600 text-xl">✓</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Guest Form Modal */}
      {showGuestForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Adicionar à Lista de Convidados
              </h3>
              <p className="text-gray-600">
                Preencha seus dados para garantir sua vaga
              </p>
            </div>
            
            <form onSubmit={handleSubmitGuest} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome completo *
                </label>
                <input
                  type="text"
                  value={newGuestData.name}
                  onChange={(e) => setNewGuestData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone (WhatsApp) *
                </label>
                <input
                  type="tel"
                  value={newGuestData.phone}
                  onChange={handlePhoneChange}
                  placeholder="(21) 98531-7129"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  value={newGuestData.email}
                  onChange={(e) => setNewGuestData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="seu.email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  value={newGuestData.notes}
                  onChange={(e) => setNewGuestData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Ex: Vou com família, tenho restrições alimentares, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  rows={4}
                />
              </div>

              {/* Confirmation Options */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Como você quer confirmar sua presença?</h4>
                
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="confirmationMethod"
                      checked={!newGuestData.confirmed}
                      onChange={() => setNewGuestData(prev => ({ ...prev, confirmed: false }))}
                      className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 mt-1"
                    />
                    <div>
                      <div className="font-medium text-gray-800">Apenas adicionar à lista</div>
                      <div className="text-sm text-gray-600">Vou confirmar depois via WhatsApp</div>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="confirmationMethod"
                      checked={newGuestData.confirmed}
                      onChange={() => setNewGuestData(prev => ({ ...prev, confirmed: true }))}
                      className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 mt-1"
                    />
                    <div>
                      <div className="font-medium text-gray-800">Confirmar presença agora</div>
                      <div className="text-sm text-gray-600">Já confirmo minha presença na festa</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {newGuestData.confirmed ? '🎉 Adicionar e Confirmar' : '✅ Adicionar à Lista'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
