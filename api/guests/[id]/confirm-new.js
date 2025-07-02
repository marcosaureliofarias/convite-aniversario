// Função separada para confirmar presença de convidados
// Endpoint: /api/guests/[id]/confirm

import { guestData } from '../../_shared/guestData.js';

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
    // Confirmar presença do convidado
    const updatedGuest = guestData.confirm(id);
    
    if (!updatedGuest) {
      return res.status(404).json({ error: 'Convidado não encontrado' });
    }

    res.status(200).json(updatedGuest);
  } catch (error) {
    console.error('Erro ao confirmar presença:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
