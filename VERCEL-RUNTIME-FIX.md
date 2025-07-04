# Fix do Erro Function Runtimes - Vercel

## Problemas Resolvidos
1. **Erro**: "Function Runtimes must have a valid version, for example `now-php@1.0.0`"
2. **Erro**: "Two or more files have conflicting paths or names"
3. **Erro**: "Found invalid Node.js Version: "22.x". Please set Node.js Version to 18.x"

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
      "runtime": "@vercel/node@5.3.2"
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

### 2. Atualização do Runtime da Vercel
- Atualizado de `@vercel/node@3.0.7` para `@vercel/node@5.3.2`
- Esta versão suporta Node.js 18.x, 20.x e 22.x

### 3. Especificação da Versão do Node.js no package.json
```json
{
  "engines": {
    "node": ">=18.x"
  }
}
```

### 4. Remoção de Arquivos Duplicados
- Removidos todos os arquivos `.js` da pasta `api/` que conflitavam com arquivos `.ts`
- Mantidos apenas os arquivos TypeScript

### 5. Dependências Atualizadas
- `@vercel/node@5.3.2` - Versão mais recente com suporte a Node.js moderno

### 6. Tipos TypeScript Corrigidos
- Adicionado `import type { VercelRequest, VercelResponse } from '@vercel/node'`
- Atualizado assinaturas das funções handler

### 7. Arquivos Finais da API
- ✅ `api/index.ts`
- ✅ `api/guests.ts`
- ✅ `api/guests/[id].ts`
- ✅ `api/guests/[id]/confirm.ts`

### 8. .vercelignore Atualizado
```
# Evitar conflitos com arquivos JavaScript duplicados
api/**/*.js
!api/_shared/*.js
```

## Como Fazer o Deploy

1. Commit das mudanças:
```bash
git add .
git commit -m "Fix: Update Vercel runtime to support Node.js 22.x"
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
- ✅ Runtime Node.js: Compatível com versões modernas
