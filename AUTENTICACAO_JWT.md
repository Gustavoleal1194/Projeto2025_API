# Autenticação JWT - Projeto2025 API

## Visão Geral
Este projeto agora implementa autenticação JWT (JSON Web Token) para proteger os endpoints da API. A autenticação suporta dois tipos de usuários:
- **Funcionários**: Acesso completo a todos os endpoints
- **Usuários**: Acesso limitado aos endpoints de usuário

## Configuração

### 1. Pacotes NuGet Adicionados
- `Microsoft.AspNetCore.Authentication.JwtBearer` (8.0.0)
- `Microsoft.IdentityModel.Tokens` (7.0.3)
- `System.IdentityModel.Tokens.Jwt` (7.0.3)

### 2. Configurações JWT (appsettings.json)
```json
{
  "Jwt": {
    "Key": "MinhaChaveSecretaSuperSeguraParaJWT2025!@#",
    "Issuer": "Projeto2025API",
    "Audience": "Projeto2025API"
  }
}
```

## Endpoints de Autenticação

### 1. Login
**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "usuario@email.com",
  "senha": "123456"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiration": "2025-01-21T10:30:00Z",
  "tipo": "Bearer",
  "nome": "Nome do Usuário",
  "email": "usuario@email.com",
  "role": "Usuario"
}
```

### 2. Registrar Usuário
**POST** `/api/auth/registrar`

**Body:**
```json
{
  "nome": "Nome do Usuário",
  "email": "usuario@email.com",
  "senha": "123456",
  "telefone": "11999999999",
  "cpf": "12345678901",
  "dataNascimento": "1990-01-01T00:00:00Z"
}
```

### 3. Registrar Funcionário (Apenas para Funcionários)
**POST** `/api/auth/registrar-funcionario`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nome": "Nome do Funcionário",
  "email": "funcionario@email.com",
  "senha": "123456",
  "telefone": "11999999999",
  "cargo": "Bibliotecário",
  "salario": 3000.00,
  "dataAdmissao": "2025-01-01T00:00:00Z"
}
```

### 4. Validar Token
**POST** `/api/auth/validar-token`

**Headers:**
```
Authorization: Bearer <token>
```

### 5. Obter Usuário Atual
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

## Proteção dos Endpoints

### Controladores Protegidos
Todos os controladores principais agora requerem autenticação:

- **EmprestimoController**: `[Authorize]` - Acesso para usuários e funcionários
- **FuncionarioController**: `[Authorize(Roles = "Funcionario")]` - Apenas funcionários
- **LivroController**: `[Authorize]` - Acesso para usuários e funcionários
- **AutorController**: `[Authorize]` - Acesso para usuários e funcionários
- **EditoraController**: `[Authorize]` - Acesso para usuários e funcionários
- **UsuarioController**: `[Authorize]` - Acesso para usuários e funcionários

### Como Usar nos Requests

Para acessar endpoints protegidos, inclua o token no header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Segurança

### Hash de Senhas
- As senhas são automaticamente hasheadas usando SHA256 + Salt
- O hash é aplicado automaticamente nos endpoints de registro
- A verificação de senha é feita de forma segura no login

### Validação de Token
- Tokens têm validade de 8 horas
- Validação automática de assinatura, emissor e audiência
- Verificação de expiração

## Exemplo de Uso Completo

### 1. Registrar um usuário
```bash
curl -X POST "https://localhost:7000/api/auth/registrar" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "123456",
    "telefone": "11999999999",
    "cpf": "12345678901",
    "dataNascimento": "1990-01-01T00:00:00Z"
  }'
```

### 2. Fazer login
```bash
curl -X POST "https://localhost:7000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "123456"
  }'
```

### 3. Usar o token para acessar endpoints protegidos
```bash
curl -X GET "https://localhost:7000/api/livro" \
  -H "Authorization: Bearer <seu_token_aqui>"
```

## Notas Importantes

1. **Chave JWT**: Em produção, use uma chave mais segura e armazene-a em variáveis de ambiente
2. **Hash de Senhas**: Para produção, considere usar BCrypt ou Argon2
3. **Refresh Tokens**: Para maior segurança, implemente refresh tokens
4. **Rate Limiting**: Considere implementar rate limiting para endpoints de login
5. **Logs de Segurança**: Monitore tentativas de login e acessos não autorizados

## Estrutura de Arquivos Criados/Modificados

### Novos Arquivos:
- `Dominio/Dtos/LoginDTO.cs`
- `Dominio/Dtos/TokenDTO.cs`
- `Interface/Service/IAuthService.cs`
- `Service/AuthService.cs`
- `Projeto2020_API/Controllers/AuthController.cs`
- `Projeto2020_API/Middleware/PasswordHashMiddleware.cs`
- `AUTENTICACAO_JWT.md`

### Arquivos Modificados:
- `Projeto2020_API/Projeto2025_API.csproj` - Adicionados pacotes JWT
- `Projeto2020_API/Program.cs` - Configuração JWT
- `Projeto2020_API/appsettings.json` - Configurações JWT
- Todos os controladores - Adicionada autorização
- `Interface/Repositorio/IUsuarioRepositorio.cs` - Método GetByEmailAsync
- `InfraEstrutura/Repositorio/UsuarioRepositorio.cs` - Implementação GetByEmailAsync
