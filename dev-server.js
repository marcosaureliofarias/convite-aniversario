const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

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

// Rotas

// GET /api/guests - Buscar todos os convidados
app.get('/api/guests', async (req, res) => {
  try {
    const db = await getDatabase();
    const collection = db.collection('guests');
    
    const guests = await collection.find({}).toArray();
    const processedGuests = guests.map(guest => ({
      ...guest,
      id: guest._id.toString(),
      _id: undefined,
      invitedAt: new Date(guest.invitedAt),
      confirmedAt: guest.confirmedAt ? new Date(guest.confirmedAt) : undefined
    }));
    
    res.json(processedGuests);
  } catch (error) {
    console.error('Erro ao buscar convidados:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// POST /api/guests - Criar novo convidado
app.post('/api/guests', async (req, res) => {
  try {
    const db = await getDatabase();
    const collection = db.collection('guests');
    
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

    res.status(201).json(createdGuest);
  } catch (error) {
    console.error('Erro ao criar convidado:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// GET /api/guests/:id - Buscar convidado por ID
app.get('/api/guests/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const collection = db.collection('guests');
    
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

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

    res.json(processedGuest);
  } catch (error) {
    console.error('Erro ao buscar convidado:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// PUT /api/guests/:id - Atualizar convidado
app.put('/api/guests/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const collection = db.collection('guests');
    
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const updates = { ...req.body };
    delete updates.id;
    delete updates._id;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Convidado não encontrado' });
    }

    const updatedGuest = await collection.findOne({ _id: new ObjectId(id) });
    const processedGuest = {
      ...updatedGuest,
      id: updatedGuest._id.toString(),
      _id: undefined,
      invitedAt: new Date(updatedGuest.invitedAt),
      confirmedAt: updatedGuest.confirmedAt ? new Date(updatedGuest.confirmedAt) : undefined
    };

    res.json(processedGuest);
  } catch (error) {
    console.error('Erro ao atualizar convidado:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// DELETE /api/guests/:id - Remover convidado
app.delete('/api/guests/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const collection = db.collection('guests');
    
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Convidado não encontrado' });
    }

    res.status(200).json({ message: 'Convidado removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover convidado:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// POST /api/guests/:id/confirm - Confirmar presença
app.post('/api/guests/:id/confirm', async (req, res) => {
  try {
    const db = await getDatabase();
    const collection = db.collection('guests');
    
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          confirmed: true,
          confirmedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Convidado não encontrado' });
    }

    const confirmedGuest = await collection.findOne({ _id: new ObjectId(id) });
    const processedGuest = {
      ...confirmedGuest,
      id: confirmedGuest._id.toString(),
      _id: undefined,
      invitedAt: new Date(confirmedGuest.invitedAt),
      confirmedAt: new Date(confirmedGuest.confirmedAt)
    };

    res.json(processedGuest);
  } catch (error) {
    console.error('Erro ao confirmar presença:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// DELETE /api/guests - Limpar todos os dados
app.delete('/api/guests', async (req, res) => {
  try {
    const db = await getDatabase();
    const collection = db.collection('guests');
    
    await collection.deleteMany({});
    res.status(200).json({ message: 'Todos os dados foram removidos' });
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de desenvolvimento rodando na porta ${PORT}`);
  console.log(`📡 APIs disponíveis em http://localhost:${PORT}/api/guests`);
  console.log('🔗 MongoDB Atlas configurado');
});

module.exports = app;
