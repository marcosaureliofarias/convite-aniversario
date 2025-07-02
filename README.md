# 🎂 Sistema de Gerenciamento de Convidados para Aniversário

Um sistema completo para gerenciar convidados de aniversário com confirmação via WhatsApp e armazenamento em arquivo JSON.

## 🚀 Funcionalidades

- ✅ Adicionar, editar e remover convidados
- 📱 Confirmação de presença via WhatsApp
- 💾 Armazenamento persistente em arquivo JSON
- 🔍 Busca e filtros
- 📊 Estatísticas em tempo real
- 🎨 Interface moderna e responsiva

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Armazenamento**: Arquivo JSON local
- **Icons**: Lucide React

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm

## 🚀 Como executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar o projeto (frontend + backend)
```bash
npm run dev
```

Isso irá iniciar:
- 🖥️ Frontend: http://localhost:5173
- 🔧 Backend: http://localhost:3001

### Comandos alternativos

```bash
# Executar apenas o servidor backend
npm run server

# Executar apenas o frontend
npm run client

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── hooks/             # Custom hooks
│   ├── services/          # Serviços da API
│   ├── types/             # Definições TypeScript
│   └── utils/             # Utilitários
├── server/                # Backend Node.js
│   ├── index.js          # Servidor Express
│   └── data/             # Arquivos de dados (criado automaticamente)
│       └── guests.json   # Dados dos convidados
└── package.json          # Dependências e scripts
```

## 🔧 Configuração

### WhatsApp
Para usar a funcionalidade de confirmação via WhatsApp, edite o número em `src/App.tsx`:

```typescript
const HOST_PHONE = '5521985317129'; // Substitua pelo seu número
```

### Dados dos Convidados
Os dados são automaticamente salvos em `server/data/guests.json`. Este arquivo é criado automaticamente na primeira execução.

## 📝 API Endpoints

- `GET /api/guests` - Listar todos os convidados
- `POST /api/guests` - Adicionar novo convidado
- `PUT /api/guests/:id` - Atualizar convidado
- `DELETE /api/guests/:id` - Remover convidado
- `PUT /api/guests/:id/confirm` - Confirmar presença

## 🎨 Personalização de Cores

O projeto usa Tailwind CSS com cores customizadas definidas em `tailwind.config.js`. As cores principais são tons de verde, mas podem ser facilmente alteradas.

## 🔒 Segurança

Este é um projeto de demonstração para uso local. Para uso em produção, considere:
- Implementar autenticação
- Validação de dados mais robusta
- HTTPS
- Rate limiting
- Backup dos dados

## 🔐 Sistema de Autenticação

O sistema possui **autenticação para o painel administrativo** para garantir que apenas pessoas autorizadas tenham acesso às funcionalidades de gerenciamento.

### Credenciais de Acesso
- **Usuário:** `marcos`
- **Senha:** `12345678`

### Como Funciona
1. **Usuários/Convidados:** Têm acesso livre à tela de convidado
2. **Administradores:** Precisam fazer login para acessar o painel administrativo
3. **Sessão:** A autenticação é mantida durante a sessão do navegador
4. **Logout:** Administradores podem fazer logout a qualquer momento

### Funcionalidades de Segurança
- ✅ Login obrigatório para acessar o modo admin
- ✅ Sessão mantida no sessionStorage
- ✅ Logout automático ao fechar o navegador
- ✅ Redirecionamento automático para tela de usuário se não autenticado
- ✅ Botão de logout visível apenas no modo admin

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.
