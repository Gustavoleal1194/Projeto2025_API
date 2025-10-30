#!/bin/bash

# Script de Deploy - Yeti Library System
echo "🚀 Iniciando deploy do Yeti Library System..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover imagens antigas (opcional)
echo "🧹 Limpando imagens antigas..."
docker system prune -f

# Build e start dos containers
echo "🔨 Fazendo build e iniciando containers..."
docker-compose up --build -d

# Verificar status dos containers
echo "📊 Verificando status dos containers..."
docker-compose ps

# Aguardar backend ficar pronto
echo "⏳ Aguardando backend ficar pronto..."
sleep 30

# Verificar se a API está respondendo
echo "🔍 Testando API..."
if curl -f http://localhost:5072/swagger > /dev/null 2>&1; then
    echo "✅ API está funcionando!"
else
    echo "❌ API não está respondendo. Verifique os logs:"
    docker-compose logs backend
fi

# Verificar se o frontend está respondendo
echo "🔍 Testando Frontend..."
if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Frontend está funcionando!"
else
    echo "❌ Frontend não está respondendo. Verifique os logs:"
    docker-compose logs frontend
fi

echo "🎉 Deploy concluído!"
echo "📱 Frontend: http://localhost"
echo "🔧 API: http://localhost:5072"
echo "📚 Swagger: http://localhost:5072/swagger"


