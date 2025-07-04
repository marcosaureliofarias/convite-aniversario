import { MongoClient, ObjectId } from 'mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Conexão com MongoDB
async function getDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://marcos:marcos@cluster0007.ctkktan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0007';
  if (!uri) {
    throw new Error('MONGODB_URI não encontrada nas variáveis de ambiente');
  }
  
  const client = new MongoClient(uri);
  await client.connect();
  return { client, db: client.db('birthday-guests') };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Adicionar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let client: MongoClient | null = null;

  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do convidado é obrigatório' });
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: `Método ${req.method} não permitido` });
    }

    const { client: mongoClient, db } = await getDatabase();
    client = mongoClient;
    const collection = db.collection('guests');

    // Confirmar presença do convidado
    const updateResult = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          confirmed: true, 
          confirmedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );

    if (!updateResult || !updateResult.value) {
      return res.status(404).json({ error: 'Convidado não encontrado' });
    }

    const confirmedGuest = {
      ...updateResult.value,
      id: updateResult.value._id.toString(),
      _id: undefined,
      invitedAt: new Date(updateResult.value.invitedAt),
      confirmedAt: new Date(updateResult.value.confirmedAt)
    };

    return res.status(200).json(confirmedGuest);
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  } finally {
    // Fechar conexão MongoDB
    if (client) {
      await client.close();
    }
  }
}
