// Vercel Serverless Function para operações específicas de um convidado
// Rota: /api/guests/[id].js

import { guestData } from '../_shared/guestData.js';

// Handler para operações específicas de um convidado
export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, query } = req;
  const { id } = query;

  if (!id) {
    return res.status(400).json({ error: 'ID do convidado é obrigatório' });
  }

  try {
    switch (method) {
      case 'GET':
        // GET /api/guests/[id] - Buscar convidado específico
        const guest = guestData.getById(id);
        if (!guest) {
          return res.status(404).json({ error: 'Convidado não encontrado' });
        }
        res.status(200).json(guest);
        break;

      case 'PUT':
        // PUT /api/guests/[id] - Atualizar convidado
        const updatedGuest = guestData.update(id, req.body);
        
        if (!updatedGuest) {
          return res.status(404).json({ error: 'Convidado não encontrado' });
        }
        
        res.status(200).json(updatedGuest);
        break;

      case 'DELETE':
        // DELETE /api/guests/[id] - Remover convidado
        const removed = guestData.remove(id);
        
        if (!removed) {
          return res.status(404).json({ error: 'Convidado não encontrado' });
        }
        
        res.status(204).end();
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({ error: `Método ${method} não permitido` });
    }
  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
