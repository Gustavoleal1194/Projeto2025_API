# Etapa de build
FROM node:18-alpine AS build

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar todas as dependências (incluindo dev)
RUN npm install

# Copiar o restante do código-fonte
COPY . .

# Build da aplicação
RUN npm run build

# Etapa de produção com Nginx
FROM nginx:alpine

# Remover configuração padrão do Nginx (opcional)
RUN rm /etc/nginx/conf.d/default.conf

# Copiar arquivos buildados para a pasta pública do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
