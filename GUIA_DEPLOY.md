








# 🚀 Guia de Deploy - Yeti Library System

## 📋 **PRÉ-REQUISITOS**

### **Sistema:**
- ✅ Docker e Docker Compose instalados
- ✅ Git instalado
- ✅ 4GB RAM disponível
- ✅ 10GB espaço em disco

### **Portas:**
- ✅ 80 (Frontend)
- ✅ 5072 (Backend API)
- ✅ 1433 (SQL Server)

---

## 🚀 **DEPLOY LOCAL (Docker)**

### **1. Clone o repositório**
```bash
git clone https://github.com/Gustavoleal1194/Projeto2025_API.git
cd Projeto2025_API
```

### **2. Execute o deploy**
```bash
# Tornar o script executável (Linux/Mac)
chmod +x deploy.sh

# Executar deploy
./deploy.sh
```

### **3. Acessar a aplicação**
- **Frontend:** http://localhost
- **API:** http://localhost:5072
- **Swagger:** http://localhost:5072/swagger

---

## 🐳 **DEPLOY MANUAL (Docker Compose)**

### **1. Configurar variáveis de ambiente**
```bash
# Editar docker-compose.yml se necessário
# Alterar senhas e URLs conforme necessário
```

### **2. Executar containers**
```bash
# Build e start
docker-compose up --build -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

### **3. Parar containers**
```bash
docker-compose down
```

---

## ☁️ **DEPLOY EM PRODUÇÃO**

### **Opção 1: VPS/Cloud (Recomendado)**

#### **1. Configurar servidor**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose git

# Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### **2. Deploy no servidor**
```bash
# Clonar repositório
git clone https://github.com/Gustavoleal1194/Projeto2025_API.git
cd Projeto2025_API

# Configurar variáveis de produção
cp frontend-yeti/env.production frontend-yeti/.env

# Editar URLs de produção
nano frontend-yeti/.env
```

#### **3. Configurar domínio**
```bash
# Editar docker-compose.yml
# Alterar ports para 80:80 e 443:443
# Configurar SSL se necessário
```

### **Opção 2: Vercel (Frontend) + Railway (Backend)**

#### **Frontend no Vercel:**
1. Conectar repositório GitHub
2. Configurar build command: `npm run build`
3. Configurar output directory: `dist`
4. Adicionar variáveis de ambiente:
   - `VITE_BACKEND_URL=https://seu-backend.railway.app`
   - `VITE_API_URL=https://seu-backend.railway.app/api`

#### **Backend no Railway:**
1. Conectar repositório GitHub
2. Configurar variáveis de ambiente
3. Deploy automático

---

## 🔧 **CONFIGURAÇÕES AVANÇADAS**

### **SSL/HTTPS**
```yaml
# docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    volumes:
      - ./ssl:/etc/nginx/ssl
    ports:
      - "443:443"
```

### **Banco de dados externo**
```yaml
# docker-compose.yml
services:
  backend:
    environment:
      - ConnectionStrings__DefaultConnection=Server=seu-servidor;Database=dbBiblioteca;User Id=usuario;Password=senha;
```

### **Monitoramento**
```bash
# Ver logs em tempo real
docker-compose logs -f

# Verificar uso de recursos
docker stats

# Backup do banco
docker exec yeti-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -Q "BACKUP DATABASE dbBiblioteca TO DISK = '/var/opt/mssql/backup/dbBiblioteca.bak'"
```

---

## 🛠️ **TROUBLESHOOTING**

### **Problema: Containers não iniciam**
```bash
# Verificar logs
docker-compose logs

# Verificar portas em uso
netstat -tulpn | grep :80
netstat -tulpn | grep :5072
```

### **Problema: Banco não conecta**
```bash
# Verificar se SQL Server está rodando
docker-compose logs sqlserver

# Testar conexão
docker exec -it yeti-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd'
```

### **Problema: Frontend não carrega**
```bash
# Verificar se build foi feito
docker-compose logs frontend

# Verificar arquivos estáticos
docker exec -it yeti-frontend ls -la /usr/share/nginx/html
```

---

## 📊 **MONITORAMENTO**

### **Health Checks**
```bash
# API
curl http://localhost:5072/swagger

# Frontend
curl http://localhost

# Banco
docker exec yeti-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -Q "SELECT 1"
```

### **Logs**
```bash
# Todos os serviços
docker-compose logs

# Serviço específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs sqlserver
```

---

## 🔄 **ATUALIZAÇÕES**

### **Atualizar aplicação**
```bash
# Parar containers
docker-compose down

# Atualizar código
git pull

# Rebuild e start
docker-compose up --build -d
```

### **Backup e Restore**
```bash
# Backup do banco
docker exec yeti-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -Q "BACKUP DATABASE dbBiblioteca TO DISK = '/var/opt/mssql/backup/dbBiblioteca.bak'"

# Restore do banco
docker exec yeti-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -Q "RESTORE DATABASE dbBiblioteca FROM DISK = '/var/opt/mssql/backup/dbBiblioteca.bak'"
```

---

## ✅ **CHECKLIST DE DEPLOY**

- [ ] Docker instalado e funcionando
- [ ] Repositório clonado
- [ ] Variáveis de ambiente configuradas
- [ ] Portas disponíveis (80, 5072, 1433)
- [ ] Containers iniciados com sucesso
- [ ] API respondendo (http://localhost:5072/swagger)
- [ ] Frontend carregando (http://localhost)
- [ ] Banco de dados conectado
- [ ] Migrações executadas
- [ ] SSL configurado (produção)
- [ ] Domínio configurado (produção)
- [ ] Monitoramento ativo
- [ ] Backup configurado

---

## 🎉 **PRÓXIMOS PASSOS**

1. **Configurar domínio personalizado**
2. **Implementar SSL/HTTPS**
3. **Configurar backup automático**
4. **Implementar monitoramento**
5. **Configurar CI/CD**
6. **Implementar testes automatizados**

---

**🎯 Sistema pronto para produção!**


