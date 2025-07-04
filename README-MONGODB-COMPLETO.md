# 🎂 Sistema de Gerenciamento de Convidados - MongoDB Atlas

Sistema completo para gerenciar convidados de festa de aniversário com **persistência em MongoDB Atlas** e deploy na **Vercel**.

## 🚀 STATUS DO PROJETO

### ✅ IMPLEMENTADO:
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: APIs serverless para Vercel + servidor local para desenvolvimento
- **Banco de Dados**: MongoDB Atlas (cloud)
- **Autenticação**: Sistema admin integrado
- **Responsive**: Interface mobile-friendly
- **WhatsApp**: Integração para envio de convites

### 🔄 FUNCIONAMENTO:
- **Desenvolvimento**: APIs locais (localhost:3001) com fallback em memória
- **Produção**: APIs serverless na Vercel conectadas ao MongoDB Atlas

## 🛠️ TECNOLOGIAS

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express (dev), Vercel Functions (prod)
- **Banco**: MongoDB Atlas
- **Deploy**: Vercel
- **Icons**: Lucide React

## 🚀 INSTALAÇÃO E USO

### 1. **Configurar MongoDB Atlas**

1. Acesse [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crie um cluster gratuito
3. Configure usuário e senha
4. Adicione IP 0.0.0.0/0 no Network Access
5. Obtenha a string de conexão

### 2. **Configurar Variáveis de Ambiente**

Crie/edite o arquivo `.env.local`:

```bash
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/birthday-guests?retryWrites=true&w=majority&appName=SeuApp
```

### 3. **Instalar e Executar**

```bash
# Instalar dependências
npm install

# Desenvolvimento (cliente + servidor local)
npm run dev
```

O projeto estará disponível em:
- **Frontend**: http://localhost:5173
- **APIs**: http://localhost:3001/api/guests

### 4. **Deploy na Vercel**

```bash
# Fazer commit
git add .
git commit -m "Deploy ready"
git push origin main

# Na Vercel:
# 1. Import do repositório
# 2. Configurar variável MONGODB_URI
# 3. Deploy automático
```

## 🎯 FUNCIONALIDADES

### **Para Usuários:**
- ✅ Visualizar lista de convidados
- ✅ Confirmar presença
- ✅ Enviar convite via WhatsApp
- ✅ Interface responsiva

### **Para Administradores:**
- ✅ Adicionar novos convidados
- ✅ Editar informações dos convidados
- ✅ Remover convidados
- ✅ Pesquisar na lista
- ✅ Exportar/Importar dados
- ✅ Limpar todos os dados
- ✅ Estatísticas em tempo real

### **Autenticação Admin:**
- **Usuário**: marcos
- **Senha**: 12345678

## 📁 ESTRUTURA DO PROJETO

```
project/
├── src/                      # Frontend React
│   ├── components/          # Componentes React
│   ├── services/           # APIs e serviços
│   ├── hooks/              # Custom hooks
│   ├── views/              # Views principais
│   └── types/              # Tipos TypeScript
├── api/                     # APIs serverless (Vercel)
│   ├── guests.ts           # CRUD principal
│   └── guests/             # Operações específicas
├── dev-server.cjs          # Servidor local de desenvolvimento
├── vercel.json             # Configuração Vercel
└── .env.local              # Variáveis de ambiente
```

## 🔧 SCRIPTS DISPONÍVEIS

```bash
npm run dev          # Desenvolvimento completo (cliente + servidor)
npm run dev:client   # Apenas frontend (Vite)
npm run dev:server   # Apenas servidor local
npm run build        # Build para produção
npm run preview      # Preview do build
```

## 📡 ENDPOINTS DA API

### **Desenvolvimento Local** (http://localhost:3001)
### **Produção** (https://seuapp.vercel.app)

- `GET /api/guests` - Listar todos os convidados
- `POST /api/guests` - Criar novo convidado
- `GET /api/guests/[id]` - Buscar convidado por ID
- `PUT /api/guests/[id]` - Atualizar convidado
- `DELETE /api/guests/[id]` - Remover convidado
- `POST /api/guests/[id]/confirm` - Confirmar presença
- `DELETE /api/guests` - Limpar todos os dados

## 🎨 PERSONALIZAÇÃO

Para personalizar para outro evento:

1. **Alterar textos**: Edite os componentes em `src/components/`
2. **Alterar cores**: Modifique `tailwind.config.js`
3. **Alterar WhatsApp**: Edite `HOST_PHONE` em `src/views/UserView.tsx`
4. **Alterar credenciais admin**: Edite `src/components/AdminLoginModal.tsx`

## 🔒 SEGURANÇA

- ✅ Validação de dados no backend
- ✅ Sanitização de inputs
- ✅ Autenticação admin
- ✅ Conexão segura com MongoDB Atlas
- ✅ Rate limiting natural da Vercel

## 🌐 DEMO

**URL de exemplo**: https://birthday-manager.vercel.app

## 📞 SUPORTE

Para dúvidas ou problemas:

1. **Erro MongoDB**: Verificar credenciais e Network Access
2. **Erro 404 APIs**: Verificar se o servidor local está rodando
3. **Erro Deploy**: Verificar variáveis de ambiente na Vercel

## 📄 LICENÇA

MIT License - Livre para uso pessoal e comercial.

---

🎉 **Sistema pronto para organizar festas de aniversário com facilidade e estilo!**
