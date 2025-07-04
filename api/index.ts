import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Adicionar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    return res.status(200).json({
      message: 'API is running successfully',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      endpoints: [
        'GET /api/guests - Listar todos os convidados',
        'POST /api/guests - Criar novo convidado',
        'DELETE /api/guests - Remover todos os convidados',
        'GET /api/guests/[id] - Buscar convidado por ID',
        'PUT /api/guests/[id] - Atualizar convidado',
        'DELETE /api/guests/[id] - Remover convidado',
        'POST /api/guests/[id]/confirm - Confirmar presença'
      ]
    });
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
