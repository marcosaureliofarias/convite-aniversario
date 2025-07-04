# Guia de Correção - FUNCTION_INVOCATION_FAILED

## Problema
Erro `FUNCTION_INVOCATION_FAILED` na Vercel indica falha na execução das funções serverless.

## Correções Aplicadas

### 1. **Gestão de Conexões MongoDB**
- Atualizado para usar variáveis de ambiente (`process.env.MONGODB_URI`)
- Adicionado fechamento adequado das conexões no bloco `finally`
- Retorno da conexão e database separadamente

### 2. **Headers CORS Adicionados**
```typescript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

### 3. **Tratamento de Erros Melhorado**
- Detalhes mais específicos nos erros
- Logs mais informativos
- Tratamento do método OPTIONS

### 4. **Estrutura Corrigida das Funções**
```typescript
let client: MongoClient | null = null;
try {
  const { client: mongoClient, db } = await getDatabase();
  client = mongoClient;
  // ... código da API
} finally {
  if (client) {
    await client.close();
  }
}
```

## Para Testar

### 1. **Configurar Variável de Ambiente na Vercel**
Na dashboard da Vercel:
- Vá em Settings → Environment Variables
- Adicione: `MONGODB_URI` = `mongodb+srv://marcos:marcos@cluster0007.ctkktan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0007`

### 2. **Testar API Base**
Acesse: `https://seu-deploy.vercel.app/api/index`
Deve retornar informações da API.

### 3. **Monitorar Logs**
Na Vercel:
- Vá em Functions → View Function Logs
- Verifique erros específicos

## URLs de Teste
- `GET /api/index` - Status da API
- `GET /api/guests` - Listar convidados
- `POST /api/guests` - Criar convidado
- `GET /api/guests/[id]` - Buscar por ID
- `POST /api/guests/[id]/confirm` - Confirmar presença

## Possíveis Causas Restantes
1. **MongoDB**: Verificar se o cluster está acessível
2. **Timeout**: Funções serverless têm limite de tempo
3. **Variáveis**: Verificar se `MONGODB_URI` está configurada na Vercel
4. **Network**: Verificar conectividade do cluster MongoDB
