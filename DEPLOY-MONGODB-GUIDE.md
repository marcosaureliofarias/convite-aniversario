# 🚀 Deploy MongoDB + Vercel - Guia Completo

## ✅ O que foi implementado

### 1. APIs Serverless na Vercel
- **`/api/guests`** - CRUD completo de convidados
- **`/api/guests/[id]`** - Operações específicas por ID
- **`/api/guests/[id]/confirm`** - Confirmação de presença
- Todas as APIs conectam diretamente ao **MongoDB Atlas**

### 2. Serviço MongoDB
- Conexão segura com MongoDB Atlas
- Operações CRUD otimizadas
- Tratamento de erros robusto
- Cache e performance otimizada

### 3. Migração Completa
- ✅ **Antes**: localStorage (dados locais)
- ✅ **Agora**: MongoDB Atlas (nuvem)
- Todas as funcionalidades mantidas
- Interface não modificada

## 🛠️ Configuração do MongoDB Atlas

### 1. Criar Cluster (GRÁTIS)
```
1. Acesse: https://cloud.mongodb.com/
2. Crie conta gratuita
3. Crie cluster (M0 Sandbox - Free forever)
4. Aguarde criação (2-3 minutos)
```

### 2. Configurar Usuário
```
Database Access → Add New Database User
- Username: admin
- Password: [gere uma senha forte]
- Database User Privileges: Read and write to any database
```

### 3. Configurar Rede
```
Network Access → Add IP Address
- Access List Entry: 0.0.0.0/0 (Allow access from anywhere)
- Comment: Vercel Deploy
```

### 4. Obter String de Conexão
```
Clusters → Connect → Connect your application
- Driver: Node.js
- Version: 4.1 or later
- Copy connection string
```

Exemplo:
```
mongodb+srv://admin:<password>@cluster0.abcd123.mongodb.net/?retryWrites=true&w=majority
```

## 🚀 Deploy na Vercel

### 1. Preparar Repositório
```bash
# Se ainda não tem git configurado
git init
git add .
git commit -m "MongoDB integration ready"

# Push para GitHub
git remote add origin https://github.com/seuusuario/seurepositorio.git
git push -u origin main
```

### 2. Deploy na Vercel
```
1. Acesse: https://vercel.com/
2. Import Git Repository
3. Conecte com GitHub
4. Selecione seu repositório
5. Configure as variáveis de ambiente (próximo passo)
6. Deploy!
```

### 3. Configurar Variáveis de Ambiente
```
No painel da Vercel:
Settings → Environment Variables → Add

Name: MONGODB_URI
Value: mongodb+srv://admin:SUASENHA@cluster0.abcd123.mongodb.net/birthday-guests?retryWrites=true&w=majority

- Marque: Production, Preview, Development
- Save
```

### 4. Redeploy
```
Após adicionar a variável:
Deployments → Latest Deployment → Redeploy
```

## 🔧 Estrutura Final das APIs

### Endpoints Funcionais:

#### `GET /api/guests`
```json
// Response: Array de convidados
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "phone": "(11) 99999-9999",
    "email": "joao@email.com",
    "notes": "Vegetariano",
    "confirmed": true,
    "invitedAt": "2025-07-04T10:00:00Z",
    "confirmedAt": "2025-07-04T15:30:00Z"
  }
]
```

#### `POST /api/guests`
```json
// Request body:
{
  "name": "Maria Santos",
  "phone": "(11) 88888-8888",
  "email": "maria@email.com",
  "notes": "Aniversariante chegou!",
  "confirmed": false
}

// Response: Convidado criado com ID
```

#### `PUT /api/guests/[id]`
```json
// Request body (campos opcionais):
{
  "name": "Maria Santos Silva",
  "confirmed": true
}

// Response: Convidado atualizado
```

#### `DELETE /api/guests/[id]`
```json
// Response:
{
  "message": "Convidado removido com sucesso"
}
```

#### `POST /api/guests/[id]/confirm`
```json
// Response: Convidado com confirmed=true e confirmedAt=now
```

## 📊 Banco de Dados

### Database: `birthday-guests`
### Collection: `guests`

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "João Silva",
  phone: "(11) 99999-9999", 
  email: "joao@email.com",    // nullable
  notes: "Observações",       // nullable
  confirmed: false,
  invitedAt: ISODate("2025-07-04T10:00:00Z"),
  confirmedAt: null           // nullable
}
```

## ✅ Checklist de Deploy

### MongoDB Atlas
- [ ] Cluster criado
- [ ] Usuário configurado
- [ ] Acesso de rede liberado
- [ ] String de conexão obtida

### Vercel
- [ ] Repositório no GitHub
- [ ] Projeto importado na Vercel
- [ ] Variável `MONGODB_URI` configurada
- [ ] Deploy realizado com sucesso

### Testes
- [ ] Site carrega normalmente
- [ ] Consegue adicionar convidado
- [ ] Consegue editar convidado
- [ ] Consegue excluir convidado
- [ ] Consegue confirmar presença
- [ ] Dados persistem após refresh

## 🔍 Debugging

### Logs da Vercel
```
Vercel Dashboard → Functions → View Function Logs
```

### MongoDB Logs
```
MongoDB Atlas → Database → Browse Collections
Verificar se dados estão sendo salvos
```

### Erros Comuns

1. **"MONGODB_URI not found"**
   - Variável não configurada na Vercel
   - Redeploy após configurar

2. **"Connection timeout"**
   - IP não liberado no Network Access
   - Verificar string de conexão

3. **"Authentication failed"**
   - Senha incorreta na string de conexão
   - Verificar usuário/senha no Database Access

## 🎉 Resultado Final

- **Frontend**: React rodando na Vercel
- **Backend**: APIs serverless na Vercel
- **Database**: MongoDB Atlas (cloud)
- **Deploy**: Automático via Git
- **Persistência**: 100% na nuvem
- **Escalabilidade**: Automática
- **Custo**: ZERO (tiers gratuitos)

---

🚀 **Seu sistema está pronto para produção!**
