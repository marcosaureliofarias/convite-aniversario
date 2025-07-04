# Sistema de Convites - Aniversário 🎉

Sistema completo para gerenciar convidados de festa de aniversário com persistência em **MongoDB Atlas** e deploy na **Vercel**.

## 🚀 Configuração do MongoDB Atlas

### 1. Criar conta no MongoDB Atlas
1. Acesse [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crie uma conta gratuita
3. Crie um novo cluster (pode usar o tier gratuito)

### 2. Configurar acesso
1. Em **Database Access**, crie um usuário com senha
2. Em **Network Access**, adicione seu IP (ou 0.0.0.0/0 para qualquer IP)
3. Em **Clusters**, clique em "Connect"
4. Escolha "Connect your application"
5. Copie a string de conexão

### 3. Configurar variáveis de ambiente
1. Renomeie `.env.example` para `.env.local`
2. Substitua a `MONGODB_URI` pela sua string de conexão real
3. Substitua `<password>` pela senha do seu usuário

Exemplo:
```env
MONGODB_URI=mongodb+srv://meuusuario:minhasenha@cluster0.abcd123.mongodb.net/birthday-guests?retryWrites=true&w=majority
```

## 🎯 Funcionalidades

### ✅ Gerenciamento Completo de Convidados
- ➕ **Adicionar** novos convidados
- ✏️ **Editar** informações dos convidados
- 🗑️ **Excluir** convidados
- ✅ **Confirmar** presença
- 🔍 **Buscar** por nome, telefone ou email
- 📊 **Estatísticas** em tempo real

### 💾 Persistência Real
- Dados salvos no **MongoDB Atlas**
- Backup automático na nuvem
- Sincronização em tempo real
- Importação/exportação de dados

### 📱 Interface Responsiva
- Design moderno e intuitivo
- Funciona em desktop e mobile
- Animações suaves
- Tema com cores personalizadas

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Vercel Functions (Serverless)
- **Banco de Dados**: MongoDB Atlas
- **Deploy**: Vercel
- **Build Tool**: Vite

## 🚀 Deploy na Vercel

### 1. Preparar o projeto
```bash
npm install
npm run build
```

### 2. Deploy
1. Faça push do código para GitHub
2. Conecte seu repositório na [Vercel](https://vercel.com)
3. Configure a variável de ambiente `MONGODB_URI` no painel da Vercel
4. Deploy automático será feito

### 3. Configurar variáveis de ambiente na Vercel
1. No painel da Vercel, vá em Settings > Environment Variables
2. Adicione: `MONGODB_URI` com o valor da sua string de conexão MongoDB

## 📁 Estrutura das APIs

### Endpoints disponíveis:

#### `GET /api/guests`
Retorna todos os convidados

#### `POST /api/guests`
Cria um novo convidado
```json
{
  "name": "João Silva",
  "phone": "(11) 99999-9999",
  "email": "joao@email.com",
  "notes": "Observações opcionais",
  "confirmed": false
}
```

#### `GET /api/guests/[id]`
Retorna um convidado específico

#### `PUT /api/guests/[id]`
Atualiza um convidado

#### `DELETE /api/guests/[id]`
Remove um convidado

#### `POST /api/guests/[id]/confirm`
Confirma a presença de um convidado

#### `DELETE /api/guests`
Remove todos os convidados (limpar dados)

## 🔧 Desenvolvimento Local

1. Clone o repositório
2. Configure o `.env.local` com sua string MongoDB
3. Instale dependências: `npm install`
4. Execute: `npm run dev`
5. Acesse: `http://localhost:5173`

## 📊 Banco de Dados

### Coleção: `guests`
```javascript
{
  _id: ObjectId,
  name: String,      // Nome do convidado
  phone: String,     // Telefone formatado
  email: String,     // Email (opcional)
  notes: String,     // Observações (opcional)
  confirmed: Boolean, // Status de confirmação
  invitedAt: Date,   // Data do convite
  confirmedAt: Date  // Data da confirmação (opcional)
}
```

## 🎨 Personalizações

O sistema está configurado para o "Aniversário do Marcos Farias" mas pode ser facilmente personalizado:

1. Edite as constantes em `src/services/mongoGuestAPI.ts`
2. Atualize os textos em `src/components/`
3. Modifique as cores no `tailwind.config.js`

## 🔒 Segurança

- Autenticação admin implementada
- Validação de dados no backend
- Sanitização de inputs
- Rate limiting natural do Vercel
- Conexão segura com MongoDB Atlas

## 📈 Monitoramento

- Logs automáticos no console da Vercel
- Métricas de uso no MongoDB Atlas
- Estatísticas em tempo real no painel admin

---

Desenvolvido com ❤️ para tornar a organização de festas mais fácil e eficiente!
