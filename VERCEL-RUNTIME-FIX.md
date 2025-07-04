# Fix do Erro Function Runtimes - Vercel

## Problema Resolvido
- **Erro**: "Function Runtimes must have a valid version, for example `now-php@1.0.0`"

## Correções Aplicadas

### 1. Configuração do vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node@3.0.7"
    },
    "api/**/*.js": {
      "runtime": "@vercel/node@3.0.7"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Dependências Adicionadas
- `@vercel/node@3.0.7` - Para tipos TypeScript da Vercel

### 3. Tipos TypeScript Corrigidos
- Adicionado `import type { VercelRequest, VercelResponse } from '@vercel/node'`
- Atualizado assinaturas das funções handler

### 4. Arquivos Corrigidos
- `api/guests.ts`
- `api/guests/[id].ts`
- `api/guests/[id]/confirm.ts`
- `api/index.ts` (criado)

## Como Fazer o Deploy

1. Commit das mudanças:
```bash
git add .
git commit -m "Fix: Vercel function runtime configuration"
git push
```

2. Deploy na Vercel:
- O deploy será automático se conectado ao Git
- Ou use: `vercel --prod`

## Variáveis de Ambiente na Vercel
Configure na dashboard da Vercel:
- `MONGODB_URI`: Sua string de conexão MongoDB

## Verificação
- Build local: ✅ Funcionando
- Tipos TypeScript: ✅ Corrigidos
- Configuração Vercel: ✅ Atualizada
