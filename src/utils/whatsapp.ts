export const generateWhatsAppLink = (phone: string, guestName: string, eventDetails?: string): string => {
  const baseMessage = `Olá! Confirmando minha presença no aniversário. ${guestName} estará presente! 🎉`;
  const fullMessage = eventDetails ? `${baseMessage}\n\n${eventDetails}` : baseMessage;
  
  // Remove formatting from phone number
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(fullMessage);
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const formatPhoneNumber = (phone: string): string => {
  const clean = phone.replace(/\D/g, '');
  
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  } else if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }
  
  return phone;
};