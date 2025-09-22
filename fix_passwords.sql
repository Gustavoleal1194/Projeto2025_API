-- Script para corrigir senhas dos usuários
-- Atualizar senhas para o hash correto de "123456"

UPDATE Usuario 
SET Senha = 'vkaW3yZ8UkZaQoh8trsDhooHKReA/FvLfp5AFY9GG0=' 
WHERE Email IN (
    'usuario.atualizado@email.com',
    'usuario@teste.com'
);

-- Verificar se as senhas foram atualizadas
SELECT Id, Nome, Email, Senha FROM Usuario;
