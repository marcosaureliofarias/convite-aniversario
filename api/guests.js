// Vercel Serverless Function para gerenciar convidados
// Este arquivo substitui o servidor Express para funcionar na Vercel

import { guestData } from './_shared/guestData.js';

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
        res.status(200).json(guestData.getAll());
        break;

      case 'POST':
        // POST /api/guests - Adicionar novo convidado
        const newGuest = guestData.add(req.body);
        res.status(201).json(newGuest);
        break;

      case 'PUT':
        if (id === 'confirm') {
          // PUT /api/guests/confirm - Confirmar presença (para compatibilidade)
          const guestId = req.body.id;
          const updatedGuest = guestData.confirm(guestId);
          
          if (!updatedGuest) {
            return res.status(404).json({ error: 'Convidado não encontrado' });
          }
          
          res.status(200).json(updatedGuest);
        } else if (id) {
          // PUT /api/guests/[id] - Atualizar convidado
          const updatedGuest = guestData.update(id, req.body);
          
          if (!updatedGuest) {
            return res.status(404).json({ error: 'Convidado não encontrado' });
          }
          
          res.status(200).json(updatedGuest);
        } else {
          res.status(400).json({ error: 'ID do convidado é obrigatório' });
        }
        break;

      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'ID do convidado é obrigatório' });
        }
        
        const removed = guestData.remove(id);
        
        if (!removed) {
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
