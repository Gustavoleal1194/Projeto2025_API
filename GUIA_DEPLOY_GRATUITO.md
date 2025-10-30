# 🆓 Guia de Deploy GRATUITO - Yeti Library System

## 🎯 **OPÇÃO 1: Vercel + Railway (RECOMENDADO)**

### **📱 FRONTEND NO VERCEL (GRATUITO)**

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

#### **Passo 3: Configurar Variáveis de Ambiente**
No Vercel, vá em Settings > Environment Variables:
```
VITE_BACKEND_URL=https://seu-backend.railway.app
VITE_API_URL=https://seu-backend.railway.app/api
VITE_FRONTEND_URL=https://seu-projeto.vercel.app
```

---

### **🔧 BACKEND NO RAILWAY (GRATUITO)**

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

#### **Passo 3: Configurar Banco de Dados**
1. No Railway, clique em "New" > "Database" > "PostgreSQL"
2. Copie a string de conexão
3. Configure as variáveis de ambiente:
```
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=postgresql://usuario:senha@host:porta/database
JwtSettings__SecretKey=MinhaChaveSecretaSuperSeguraParaJWT2025
JwtSettings__Issuer=Projeto2025API
JwtSettings__Audience=Projeto2025API
JwtSettings__ExpirationHours=8
```

---

## 🎯 **OPÇÃO 2: Render (TUDO EM UM LUGAR)**

### **📱 FRONTEND NO RENDER**
1. Acesse: https://render.com
2. Conecte com GitHub
3. Clique em "New" > "Static Site"
4. Configure:
   - **Repository:** Seu repositório
   - **Root Directory:** `frontend-yeti`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

### **🔧 BACKEND NO RENDER**
1. Clique em "New" > "Web Service"
2. Configure:
   - **Repository:** Seu repositório
   - **Root Directory:** `Projeto2020_API`
   - **Build Command:** `dotnet publish -c Release -o /app/publish`
   - **Start Command:** `dotnet Projeto2020_API.dll`

### **🗄️ BANCO NO RENDER**
1. Clique em "New" > "PostgreSQL"
2. Copie a string de conexão
3. Configure no Backend:
```
ConnectionStrings__DefaultConnection=postgresql://usuario:senha@host:porta/database
```

---

## 🎯 **OPÇÃO 3: Netlify + Heroku (CLÁSSICO)**

### **📱 FRONTEND NO NETLIFY**
1. Acesse: https://netlify.com
2. Conecte com GitHub
3. Configure:
   - **Repository:** Seu repositório
   - **Base Directory:** `frontend-yeti`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

### **🔧 BACKEND NO HEROKU**
1. Acesse: https://heroku.com
2. Crie um novo app
3. Conecte com GitHub
4. Configure as variáveis de ambiente
5. Adicione addon PostgreSQL

---

## 🚀 **TUTORIAL PASSO A PASSO (Vercel + Railway)**

### **PASSO 1: Preparar o Frontend**

#### **1.1 Criar arquivo de configuração do Vercel**
```json
// vercel.json (na pasta frontend-yeti)
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### **1.2 Atualizar package.json**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

### **PASSO 2: Preparar o Backend**

#### **2.1 Criar arquivo de configuração do Railway**
```json
// railway.json (na pasta Projeto2020_API)
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "dotnet Projeto2020_API.dll",
    "healthcheckPath": "/swagger"
  }
}
```

#### **2.2 Atualizar appsettings.Production.json**
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "JwtSettings": {
    "SecretKey": "MinhaChaveSecretaSuperSeguraParaJWT2025",
    "Issuer": "Projeto2025API",
    "Audience": "Projeto2025API",
    "ExpirationHours": 8
  }
}
```

### **PASSO 3: Deploy no Vercel**

#### **3.1 Conectar repositório**
1. Acesse https://vercel.com
2. Clique em "New Project"
3. Selecione seu repositório GitHub
4. Configure:
   - **Framework:** Vite
   - **Root Directory:** `frontend-yeti`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

#### **3.2 Configurar variáveis de ambiente**
No Vercel, vá em Settings > Environment Variables:
```
VITE_BACKEND_URL=https://seu-backend.railway.app
VITE_API_URL=https://seu-backend.railway.app/api
VITE_FRONTEND_URL=https://seu-projeto.vercel.app
```

### **PASSO 4: Deploy no Railway**

#### **4.1 Conectar repositório**
1. Acesse https://railway.app
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha seu repositório

#### **4.2 Configurar serviço**
1. Clique no serviço criado
2. Configure:
   - **Root Directory:** `Projeto2020_API`
   - **Build Command:** `dotnet publish -c Release -o /app/publish`
   - **Start Command:** `dotnet Projeto2020_API.dll`

#### **4.3 Adicionar banco de dados**
1. Clique em "New" > "Database" > "PostgreSQL"
2. Copie a string de conexão
3. Configure no backend:
```
ConnectionStrings__DefaultConnection=postgresql://usuario:senha@host:porta/database
```

### **PASSO 5: Configurar CORS**

#### **5.1 Atualizar Program.cs**
```csharp
// Adicionar CORS para produção
builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", policy =>
    {
        policy.WithOrigins("https://seu-projeto.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Usar CORS
app.UseCors("Production");
```

### **PASSO 6: Testar Deploy**

#### **6.1 Verificar Frontend**
- Acesse sua URL do Vercel
- Teste o login
- Verifique se as chamadas de API funcionam

#### **6.2 Verificar Backend**
- Acesse sua URL do Railway + `/swagger`
- Teste os endpoints
- Verifique logs no Railway

---

## 🔧 **CONFIGURAÇÕES IMPORTANTES**

### **Variáveis de Ambiente (Railway)**
```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
ConnectionStrings__DefaultConnection=postgresql://usuario:senha@host:porta/database
JwtSettings__SecretKey=MinhaChaveSecretaSuperSeguraParaJWT2025
JwtSettings__Issuer=Projeto2025API
JwtSettings__Audience=Projeto2025API
JwtSettings__ExpirationHours=8
```

### **Variáveis de Ambiente (Vercel)**
```
VITE_BACKEND_URL=https://seu-backend.railway.app
VITE_API_URL=https://seu-backend.railway.app/api
VITE_FRONTEND_URL=https://seu-projeto.vercel.app
```

---

## 🎉 **RESULTADO FINAL**

Após o deploy, você terá:
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

### **Render:**
- ✅ 750 horas/mês
- ✅ Banco PostgreSQL incluído
- ✅ Deploys automáticos

---

## 🚨 **DICAS IMPORTANTES**

1. **Sempre teste localmente primeiro**
2. **Configure CORS corretamente**
3. **Use variáveis de ambiente para URLs**
4. **Monitore os logs**
5. **Faça backup do banco regularmente**

---

**🎯 Com essas configurações, seu sistema estará 100% online e gratuito!**


