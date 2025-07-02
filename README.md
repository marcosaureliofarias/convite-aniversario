# 🎂 Sistema de Gerenciamento de Convidados para Aniversário

Um sistema completo para gerenciar convidados de aniversário com confirmação via WhatsApp e armazenamento local no navegador.

## 🚀 Funcionalidades

- ✅ Adicionar, editar e remover convidados
- 📱 Confirmação de presença via WhatsApp
- 💾 Armazenamento persistente no localStorage do navegador
- 🔍 Busca e filtros
- 📊 Estatísticas em tempo real
- 🎨 Interface moderna e responsiva
- 📥 Importar/Exportar dados dos convidados
- 🧹 Limpeza completa de dados

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Tailwind CSS
- **Armazenamento**: localStorage (navegador)
- **Icons**: Lucide React
- **Build**: Vite

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm

## 🚀 Como executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar o projeto
```bash
npm run dev
```

Isso irá iniciar:
- 🖥️ Frontend: http://localhost:5173

### Comandos disponíveis

```bash
# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 📁 Estrutura do Projeto

```
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── hooks/             # Custom hooks
│   ├── services/          # Serviços (agora localStorage)
│   ├── types/             # Definições TypeScript
│   ├── utils/             # Utilitários
│   └── views/             # Views principais
└── package.json          # Dependências e scripts
```

## 🔧 Configuração

### WhatsApp
Para usar a funcionalidade de confirmação via WhatsApp, edite o número em `src/views/AdminView.tsx` e `src/views/UserView.tsx`:

```typescript
const HOST_PHONE = '5521985317129'; // Substitua pelo seu número
```

### Dados dos Convidados
Os dados são automaticamente salvos no **localStorage do navegador**. Isso significa que:
- ✅ Os dados persistem entre sessões
- ✅ Não precisa de servidor backend
- ✅ Funciona offline
- ⚠️ Os dados ficam limitados ao navegador específico

## � Gerenciamento de Dados

### Exportar Dados
- Clique em "Exportar" no painel administrativo
- Baixa um arquivo JSON com todos os dados dos convidados
- Inclui estatísticas e informações do evento

### Importar Dados
- Clique em "Importar" no painel administrativo
- Selecione um arquivo JSON previamente exportado
- Os dados serão carregados no sistema

### Limpar Dados
- Clique em "Limpar" no painel administrativo
- Remove TODOS os convidados (ação irreversível)
- Confirma duas vezes antes de executar

## 🎨 Personalização de Cores

O projeto usa Tailwind CSS com cores customizadas definidas em `tailwind.config.js`. As cores principais são tons de verde e vermelho, mas podem ser facilmente alteradas.

## � Sistema de Autenticação

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

## 🌐 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure o build command: `npm run build`
3. Configure o output directory: `dist`
4. Deploy automático!

### Netlify
1. Conecte seu repositório ao Netlify
2. Configure o build command: `npm run build`
3. Configure o publish directory: `dist`
4. Deploy automático!

### Outros Provedores
Qualquer provedor que suporte sites estáticos funcionará:
- Vercel ✅
- Netlify ✅
- GitHub Pages ✅
- Firebase Hosting ✅

## 💡 Vantagens da Nova Arquitetura

### ✅ Prós
- **Simplicidade**: Sem necessidade de servidor backend
- **Performance**: Tudo roda no cliente
- **Confiabilidade**: Sem dependência de APIs externas
- **Custo**: Deploy gratuito em qualquer CDN
- **Velocidade**: Acesso instantâneo aos dados

### ⚠️ Considerações
- **Escopo**: Dados limitados ao navegador específico
- **Colaboração**: Para uso por múltiplas pessoas, use exportar/importar
- **Backup**: Importante fazer backup dos dados regularmente

## 🔒 Segurança

Este é um projeto para uso pessoal/local. Para uso em produção com múltiplos usuários, considere:
- Implementar autenticação mais robusta
- Usar um banco de dados centralizado
- Implementar HTTPS
- Validação de dados mais rigorosa

## 📄 Licença

MIT License

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
