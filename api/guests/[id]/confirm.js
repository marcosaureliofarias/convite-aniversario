// Função separada para confirmar presença de convidados
// Endpoint: /api/guests/[id]/confirm

let guests = [
  // Esta array será compartilhada entre as funções em produção
  // Em um ambiente real, você usaria um banco de dados
];

export default function handler(req, res) {
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
    // Buscar o convidado
    const guestIndex = guests.findIndex(g => g.id === id);
    
    if (guestIndex === -1) {
      return res.status(404).json({ error: 'Convidado não encontrado' });
    }
    
    // Confirmar presença
    guests[guestIndex] = {
      ...guests[guestIndex],
      confirmed: true,
      confirmedAt: new Date().toISOString()
    };
    
    res.status(200).json(guests[guestIndex]);
  } catch (error) {
    console.error('Erro ao confirmar convidado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
