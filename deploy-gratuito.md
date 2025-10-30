# 🆓 Deploy GRATUITO - Passo a Passo

## 🎯 **MÉTODO MAIS FÁCIL: Vercel + Railway**

### **📱 PARTE 1: FRONTEND NO VERCEL**

#### **Passo 1: Criar conta no Vercel**
1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Conecte com sua conta GitHub

#### **Passo 2: Deploy do Frontend**
1. No Vercel, clique em "New Project"
2. Selecione seu repositório: `Projeto2025_API`
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend-yeti`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Clique em "Deploy"

#### **Passo 3: Anotar a URL do Frontend**
- Exemplo: `https://projeto2025-api.vercel.app`
- **GUARDE ESTA URL!** Você vai precisar dela para o backend.

---

### **🔧 PARTE 2: BACKEND NO RAILWAY**

#### **Passo 1: Criar conta no Railway**
1. Acesse: https://railway.app
2. Clique em "Login" e conecte com GitHub

#### **Passo 2: Deploy do Backend**
1. Clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Escolha seu repositório: `Projeto2025_API`
4. Configure:
   - **Root Directory:** `Projeto2020_API`
   - **Build Command:** `dotnet publish -c Release -o /app/publish`
   - **Start Command:** `dotnet Projeto2020_API.dll`

#### **Passo 3: Adicionar Banco de Dados**
1. No Railway, clique em "New" > "Database" > "PostgreSQL"
2. Clique no banco criado
3. Vá em "Connect" > "Postgres"
4. **COPIE A STRING DE CONEXÃO!**

#### **Passo 4: Configurar Variáveis de Ambiente**
No Railway, vá em "Variables" e adicione:
```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
ConnectionStrings__DefaultConnection=postgresql://usuario:senha@host:porta/database
JwtSettings__SecretKey=MinhaChaveSecretaSuperSeguraParaJWT2025
JwtSettings__Issuer=Projeto2025API
JwtSettings__Audience=Projeto2025API
JwtSettings__ExpirationHours=8
```

#### **Passo 5: Anotar a URL do Backend**
- Exemplo: `https://projeto2025-api-production.up.railway.app`
- **GUARDE ESTA URL!** Você vai precisar dela para o frontend.

---

### **🔗 PARTE 3: CONECTAR FRONTEND E BACKEND**

#### **Passo 1: Atualizar Frontend no Vercel**
1. No Vercel, vá em seu projeto
2. Clique em "Settings" > "Environment Variables"
3. Adicione:
```
VITE_BACKEND_URL=https://sua-url-do-railway.app
VITE_API_URL=https://sua-url-do-railway.app/api
VITE_FRONTEND_URL=https://sua-url-do-vercel.app
```

#### **Passo 2: Fazer Redeploy**
1. No Vercel, vá em "Deployments"
2. Clique nos 3 pontos do último deploy
3. Clique em "Redeploy"

---

### **🗄️ PARTE 4: CONFIGURAR BANCO DE DADOS**

#### **Passo 1: Executar Migrações**
1. No Railway, vá em seu backend
2. Clique em "Logs"
3. Verifique se o banco está conectado
4. Se necessário, execute as migrações manualmente

#### **Passo 2: Testar Conexão**
1. Acesse sua URL do backend + `/swagger`
2. Teste os endpoints
3. Verifique se não há erros de conexão

---

## 🎉 **RESULTADO FINAL**

Após seguir todos os passos, você terá:
- ✅ **Frontend:** https://seu-projeto.vercel.app
- ✅ **Backend:** https://seu-backend.railway.app
- ✅ **Swagger:** https://seu-backend.railway.app/swagger
- ✅ **Banco:** PostgreSQL gerenciado pelo Railway

---

## 🆓 **LIMITES GRATUITOS**

### **Vercel:**
- ✅ 100GB bandwidth/mês
- ✅ Deploys ilimitados
- ✅ Domínio personalizado
- ✅ SSL automático

### **Railway:**
- ✅ $5 de crédito/mês (suficiente para pequenos projetos)
- ✅ Banco PostgreSQL incluído
- ✅ Deploys automáticos
- ✅ Logs em tempo real

---

## 🚨 **DICAS IMPORTANTES**

1. **Sempre teste localmente primeiro**
2. **Configure CORS corretamente**
3. **Use variáveis de ambiente para URLs**
4. **Monitore os logs**
5. **Faça backup do banco regularmente**

---

## 🔧 **TROUBLESHOOTING**

### **Problema: Frontend não carrega**
- Verifique se as variáveis de ambiente estão corretas
- Verifique se o build foi feito com sucesso
- Verifique os logs no Vercel

### **Problema: Backend não conecta**
- Verifique se a string de conexão está correta
- Verifique se o banco está rodando
- Verifique os logs no Railway

### **Problema: CORS error**
- Verifique se as URLs estão corretas no CORS
- Verifique se o frontend está usando HTTPS

---

**🎯 Com essas configurações, seu sistema estará 100% online e gratuito!**


