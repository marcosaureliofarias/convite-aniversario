import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const GUESTS_FILE = path.join(__dirname, 'data', 'guests.json');

// Middleware
app.use(cors());
app.use(express.json());

// Garantir que o diretório de dados existe
const ensureDataDir = async () => {
  const dataDir = path.dirname(GUESTS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Função para ler os convidados do arquivo
const readGuests = async () => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(GUESTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, retorna array vazio
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

// Função para salvar os convidados no arquivo
const writeGuests = async (guests) => {
  await ensureDataDir();
  await fs.writeFile(GUESTS_FILE, JSON.stringify(guests, null, 2));
};

// Rotas da API

// GET /api/guests - Buscar todos os convidados
app.get('/api/guests', async (req, res) => {
  try {
    const guests = await readGuests();
    res.json(guests);
  } catch (error) {
    console.error('Erro ao buscar convidados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/guests - Adicionar novo convidado
app.post('/api/guests', async (req, res) => {
  try {
    const guests = await readGuests();
    const newGuest = {
      ...req.body,
      id: crypto.randomUUID(),
      invitedAt: new Date().toISOString()
    };
    
    guests.push(newGuest);
    await writeGuests(guests);
    
    res.status(201).json(newGuest);
  } catch (error) {
    console.error('Erro ao adicionar convidado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/guests/:id - Atualizar convidado
app.put('/api/guests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const guests = await readGuests();
    const index = guests.findIndex(g => g.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Convidado não encontrado' });
    }
    
    guests[index] = { ...guests[index], ...req.body };
    await writeGuests(guests);
    
    res.json(guests[index]);
  } catch (error) {
    console.error('Erro ao atualizar convidado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/guests/:id - Remover convidado
app.delete('/api/guests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const guests = await readGuests();
    const filteredGuests = guests.filter(g => g.id !== id);
    
    if (filteredGuests.length === guests.length) {
      return res.status(404).json({ error: 'Convidado não encontrado' });
    }
    
    await writeGuests(filteredGuests);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao remover convidado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/guests/:id/confirm - Confirmar presença
app.put('/api/guests/:id/confirm', async (req, res) => {
  try {
    const { id } = req.params;
    const guests = await readGuests();
    const index = guests.findIndex(g => g.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Convidado não encontrado' });
    }
    
    guests[index] = {
      ...guests[index],
      confirmed: true,
      confirmedAt: new Date().toISOString()
    };
    
    await writeGuests(guests);
    res.json(guests[index]);
  } catch (error) {
    console.error('Erro ao confirmar convidado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📁 Arquivo de dados: ${GUESTS_FILE}`);
});
