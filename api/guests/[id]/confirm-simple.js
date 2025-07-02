// Função separada para confirmar presença de convidados
// Endpoint: /api/guests/[id]/confirm

// Dados em memória (compartilhados entre requisições da mesma instância)
let guests = [
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

module.exports = function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { query } = req;
  const { id } = query;

  try {
    // Buscar e confirmar presença do convidado
    const guestIndex = guests.findIndex(g => g.id === id);
    
    if (guestIndex === -1) {
      return res.status(404).json({ error: 'Convidado não encontrado' });
    }

    guests[guestIndex] = {
      ...guests[guestIndex],
      confirmed: true,
      confirmedAt: new Date().toISOString()
    };

    res.status(200).json(guests[guestIndex]);
  } catch (error) {
    console.error('Erro ao confirmar presença:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
