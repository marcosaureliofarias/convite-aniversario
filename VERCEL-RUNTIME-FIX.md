# Fix do Erro Function Runtimes - Vercel

## Problemas Resolvidos
1. **Erro**: "Function Runtimes must have a valid version, for example `now-php@1.0.0`"
2. **Erro**: "Two or more files have conflicting paths or names"

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

### 2. Remoção de Arquivos Duplicados
- Removidos todos os arquivos `.js` da pasta `api/` que conflitavam com arquivos `.ts`
- Mantidos apenas os arquivos TypeScript

### 3. Dependências Adicionadas
- `@vercel/node@3.0.7` - Para tipos TypeScript da Vercel

### 4. Tipos TypeScript Corrigidos
- Adicionado `import type { VercelRequest, VercelResponse } from '@vercel/node'`
- Atualizado assinaturas das funções handler

### 5. Arquivos Finais da API
- ✅ `api/index.ts`
- ✅ `api/guests.ts`
- ✅ `api/guests/[id].ts`
- ✅ `api/guests/[id]/confirm.ts`

### 6. .vercelignore Atualizado
```
# Evitar conflitos com arquivos JavaScript duplicados
api/**/*.js
!api/_shared/*.js
```

## Como Fazer o Deploy

1. Commit das mudanças:
```bash
git add .
git commit -m "Fix: Remove duplicate JS files and update Vercel config"
git push
```

2. Deploy na Vercel:
- O deploy será automático se conectado ao Git
- Ou use: `vercel --prod`

## Variáveis de Ambiente na Vercel
Configure na dashboard da Vercel:
- `MONGODB_URI`: Sua string de conexão MongoDB

## Verificação
- ✅ Build local: Funcionando
- ✅ Tipos TypeScript: Corrigidos
- ✅ Configuração Vercel: Atualizada
- ✅ Arquivos duplicados: Removidos
- ✅ Conflitos: Resolvidos
