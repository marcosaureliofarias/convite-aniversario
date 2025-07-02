// Sistema de dados em memória compartilhado para as APIs da Vercel
// ATENÇÃO: Em produção, substitua por um banco de dados real

let guests = [
  // Dados de exemplo - em produção, use um banco de dados
  {
    "name": "Gabriel Neves",
    "phone": "(21) 98940-6508",
    "email": "gabrielneves59.gn@gmail.com",
    "notes": "Gabriel e família",
    "confirmed": true,
    "confirmedAt": "2025-07-01T23:12:05.406Z",
    "id": "21f7dea2-e8c3-4cd6-8986-6358bd0a0667",
    "invitedAt": "2025-07-01T23:12:05.416Z"
  },
  {
    "name": "Fernandinha",
    "phone": "(21) 99344-2233",
    "email": "fernanda@gmail.com",
    "notes": "Fernanda e Familia",
    "confirmed": true,
    "confirmedAt": "2025-07-01T23:15:14.862Z",
    "id": "f0d3d8d9-db97-4ddf-a215-9246a1926ed2",
    "invitedAt": "2025-07-01T23:15:14.869Z"
  }
];

// Função para gerar UUID simples
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Exportar funções para manipular dados
export const guestData = {
  // Obter todos os convidados
  getAll: () => guests,
  
  // Obter convidado por ID
  getById: (id) => guests.find(g => g.id === id),
  
  // Adicionar convidado
  add: (guestData) => {
    const newGuest = {
      ...guestData,
      id: generateId(),
      invitedAt: new Date().toISOString()
    };
    guests.push(newGuest);
    return newGuest;
  },
  
  // Atualizar convidado
  update: (id, updates) => {
    const index = guests.findIndex(g => g.id === id);
    if (index === -1) return null;
    
    guests[index] = { ...guests[index], ...updates };
    return guests[index];
  },
  
  // Remover convidado
  remove: (id) => {
    const initialLength = guests.length;
    guests = guests.filter(g => g.id !== id);
    return guests.length < initialLength;
  },
  
  // Confirmar presença
  confirm: (id) => {
    const index = guests.findIndex(g => g.id === id);
    if (index === -1) return null;
    
    guests[index] = {
      ...guests[index],
      confirmed: true,
      confirmedAt: new Date().toISOString()
    };
    return guests[index];
  }
};
