// Vercel Serverless Function para gerenciar convidados
// Este arquivo substitui o servidor Express para funcionar na Vercel

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

// Handler principal da API
export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, query } = req;
  const { id } = query;

  try {
    switch (method) {
      case 'GET':
        // GET /api/guests - Buscar todos os convidados
        res.status(200).json(guests);
        break;

      case 'POST':
        // POST /api/guests - Adicionar novo convidado
        const newGuest = {
          ...req.body,
          id: generateId(),
          invitedAt: new Date().toISOString()
        };
        guests.push(newGuest);
        res.status(201).json(newGuest);
        break;

      case 'PUT':
        if (id === 'confirm') {
          // PUT /api/guests/confirm - Confirmar presença (para compatibilidade)
          const guestId = req.body.id;
          const guestIndex = guests.findIndex(g => g.id === guestId);
          
          if (guestIndex === -1) {
            return res.status(404).json({ error: 'Convidado não encontrado' });
          }
          
          guests[guestIndex] = {
            ...guests[guestIndex],
            confirmed: true,
            confirmedAt: new Date().toISOString()
          };
          
          res.status(200).json(guests[guestIndex]);
        } else if (id) {
          // PUT /api/guests/[id] - Atualizar convidado
          const guestIndex = guests.findIndex(g => g.id === id);
          
          if (guestIndex === -1) {
            return res.status(404).json({ error: 'Convidado não encontrado' });
          }
          
          guests[guestIndex] = { ...guests[guestIndex], ...req.body };
          res.status(200).json(guests[guestIndex]);
        } else {
          res.status(400).json({ error: 'ID do convidado é obrigatório' });
        }
        break;

      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'ID do convidado é obrigatório' });
        }
        
        const initialLength = guests.length;
        guests = guests.filter(g => g.id !== id);
        
        if (guests.length === initialLength) {
          return res.status(404).json({ error: 'Convidado não encontrado' });
        }
        
        res.status(204).end();
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ error: `Método ${method} não permitido` });
    }
  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
