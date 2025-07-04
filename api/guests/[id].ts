import { MongoClient, ObjectId } from 'mongodb';

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

export default async function handler(req: any, res: any) {
  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do convidado é obrigatório' });
    }

    const db = await getDatabase();
    const collection = db.collection('guests');

    switch (req.method) {
      case 'GET':
        // Buscar convidado específico
        const guest = await collection.findOne({ _id: new ObjectId(id) });
        
        if (!guest) {
          return res.status(404).json({ error: 'Convidado não encontrado' });
        }

        const processedGuest = {
          ...guest,
          id: guest._id.toString(),
          _id: undefined,
          invitedAt: new Date(guest.invitedAt),
          confirmedAt: guest.confirmedAt ? new Date(guest.confirmedAt) : undefined
        };

        return res.status(200).json(processedGuest);

      case 'PUT':
        // Atualizar convidado
        const updates = req.body;
        const updateData: any = {};

        if (updates.name) updateData.name = updates.name.trim();
        if (updates.phone) updateData.phone = updates.phone.trim();
        if (updates.email !== undefined) updateData.email = updates.email?.trim() || null;
        if (updates.notes !== undefined) updateData.notes = updates.notes?.trim() || null;
        if (updates.confirmed !== undefined) {
          updateData.confirmed = updates.confirmed;
          if (updates.confirmed && !updates.confirmedAt) {
            updateData.confirmedAt = new Date();
          } else if (!updates.confirmed) {
            updateData.confirmedAt = null;
          }
        }

        const updateResult = await collection.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: updateData },
          { returnDocument: 'after' }
        );

        if (!updateResult || !updateResult.value) {
          return res.status(404).json({ error: 'Convidado não encontrado' });
        }

        const updatedGuest = {
          ...updateResult.value,
          id: updateResult.value._id.toString(),
          _id: undefined,
          invitedAt: new Date(updateResult.value.invitedAt),
          confirmedAt: updateResult.value.confirmedAt ? new Date(updateResult.value.confirmedAt) : undefined
        };

        return res.status(200).json(updatedGuest);

      case 'DELETE':
        // Remover convidado
        const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });
        
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: 'Convidado não encontrado' });
        }

        return res.status(200).json({ message: 'Convidado removido com sucesso' });

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Método ${req.method} não permitido` });
    }
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
