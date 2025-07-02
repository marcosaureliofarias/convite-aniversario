# 🚀 Deploy na Vercel

## ⚠️ **Importante - Limitações da Versão Vercel**

Esta versão foi adaptada para funcionar na Vercel, mas tem algumas limitações:

### 📊 **Armazenamento de Dados**
- **Desenvolvimento Local**: Dados salvos em arquivo JSON
- **Vercel (Produção)**: Dados armazenados em memória temporária
- **⚠️ ATENÇÃO**: Os dados serão perdidos a cada deploy ou restart

### 🔄 **Para Produção Real**
Para usar em produção, recomenda-se integrar com um banco de dados:
- **Supabase** (PostgreSQL gratuito)
- **MongoDB Atlas** (NoSQL gratuito)
- **Vercel KV** (Redis da Vercel)
- **PlanetScale** (MySQL serverless)

## 🚀 **Como fazer o Deploy**

### 1. **Conectar com GitHub**
```bash
# Fazer commit das alterações
git add .
git commit -m "Preparado para Vercel"
git push origin main
```

### 2. **Deploy na Vercel**
1. Acesse [vercel.com](https://vercel.com)
2. Conecte sua conta do GitHub
3. Importe o repositório
4. A Vercel detectará automaticamente como um projeto Vite
5. Clique em "Deploy"

### 3. **Configurações Automáticas**
- ✅ **Build Command**: `npm run build` (já configurado)
- ✅ **Output Directory**: `dist` (já configurado)
- ✅ **Install Command**: `npm install` (já configurado)

## 📁 **Estrutura para Vercel**

```
project/
├── api/                    # Serverless Functions
│   ├── guests.js          # API principal de convidados
│   └── guests/
│       └── [id]/
│           └── confirm.js  # Confirmar presença
├── src/                   # Frontend React
├── dist/                  # Build output (criado automaticamente)
├── vercel.json           # Configuração da Vercel
└── package.json          # Scripts atualizados
```

## 🔧 **Funcionalidades na Vercel**

### ✅ **O que funciona:**
- Interface completa do usuário
- Painel administrativo com autenticação
- Adicionar convidados
- Confirmar presença
- WhatsApp integration
- Alternância entre modos
- Favicon personalizado (MF - Marcos Farias)

### ⚠️ **Limitações:**
- Dados não persistem entre deploys
- Não há backup automático
- Múltiplas instâncias podem ter dados diferentes

## 🐛 **Problemas Resolvidos**

### ✅ **Favicon 404 Error**
- **Problema**: Referência a `/vite.svg` inexistente
- **Solução**: Criado `public/favicon.svg` personalizado com iniciais "MF"
- **Status**: ✅ Resolvido

### ✅ **MIME Type Error (Tela Branca)**
- **Problema**: "Expected JavaScript module but server responded with HTML"
- **Causa**: Configuração incorreta de roteamento na Vercel
- **Soluções Implementadas**:
  - Configuração específica de rotas para assets JavaScript/CSS
  - Headers corretos para tipos MIME
  - Arquivo `_headers` para configurações adicionais
  - Vite configurado com output específico para Vercel
- **Status**: ✅ Resolvido

## 💾 **Soluções para Persistência**

### Opção 1: Supabase (Recomendado)
```typescript
// Substituir guestAPI.ts por integração com Supabase
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(URL, KEY)
```

### Opção 2: Vercel KV
```typescript
// Usar Vercel KV para armazenamento Redis
import { kv } from '@vercel/kv'
```

### Opção 3: MongoDB Atlas
```typescript
// Conectar com MongoDB
import { MongoClient } from 'mongodb'
```

## 🌐 **URL de Exemplo**
Após o deploy, sua aplicação estará disponível em:
`https://seu-projeto.vercel.app`

## 🔐 **Credenciais Admin**
- **Usuário**: marcos
- **Senha**: 12345678

## 📞 **WhatsApp**
Certifique-se de atualizar o número no arquivo:
`src/views/UserView.tsx` linha 6:
```typescript
const HOST_PHONE = '5521985317129'; // Seu número
```
