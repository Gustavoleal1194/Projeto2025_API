# Teste simples para endpoint de registro
$usuario = @{
    Nome           = "Teste Usuario"
    Email          = "teste3@teste.com"
    CPF            = "12345678901"
    DataNascimento = "1990-01-01"
    Telefone       = "11999999999"
    Senha          = "123456"
} | ConvertTo-Json

Write-Host "Testando registro de usuario..." -ForegroundColor Yellow
Write-Host "JSON: $usuario" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5072/api/auth/registrar" -Method POST -Body $usuario -ContentType "application/json"
    Write-Host "SUCESSO: Usuario criado com ID $($response.Id)" -ForegroundColor Green
}
catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Resposta do servidor: $responseBody" -ForegroundColor Red
    }
}
