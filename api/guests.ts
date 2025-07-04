import { MongoClient } from 'mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Tipos do convidado
interface Guest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  confirmed: boolean;
  invitedAt: Date;
  confirmedAt?: Date;
}

// Conexão com MongoDB
async function getDatabase() {
  const uri = 'mongodb+srv://marcos:marcos@cluster0007.ctkktan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0007';
  if (!uri) {
    throw new Error('MONGODB_URI não encontrada nas variáveis de ambiente');
  }
  
  const client = new MongoClient(uri);
  await client.connect();
  return client.db('birthday-guests');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDatabase();
    const collection = db.collection('guests');

    switch (req.method) {
      case 'GET':
        // Buscar todos os convidados
        const guests = await collection.find({}).toArray();
        const processedGuests = guests.map(guest => ({
          ...guest,
          id: guest._id.toString(),
          _id: undefined,
          invitedAt: new Date(guest.invitedAt),
          confirmedAt: guest.confirmedAt ? new Date(guest.confirmedAt) : undefined
        }));
        return res.status(200).json(processedGuests);

      case 'POST':
        // Criar novo convidado
        const { name, phone, email, notes, confirmed } = req.body;
        
        if (!name || !phone) {
          return res.status(400).json({ error: 'Nome e telefone são obrigatórios' });
        }

        const newGuest = {
          name: name.trim(),
          phone: phone.trim(),
          email: email?.trim() || null,
          notes: notes?.trim() || null,
          confirmed: confirmed || false,
          invitedAt: new Date(),
          confirmedAt: confirmed ? new Date() : null
        };

        const result = await collection.insertOne(newGuest);
        const createdGuest = {
          ...newGuest,
          id: result.insertedId.toString(),
          _id: undefined
        };

        return res.status(201).json(createdGuest);

      case 'DELETE':
        // Limpar todos os dados
        await collection.deleteMany({});
        return res.status(200).json({ message: 'Todos os dados foram removidos' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).json({ error: `Método ${req.method} não permitido` });
    }
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
