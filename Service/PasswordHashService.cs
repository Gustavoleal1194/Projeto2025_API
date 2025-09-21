using System.Security.Cryptography;
using System.Text;

namespace Service
{
    public static class PasswordHashService
    {
        public static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var salt = "Projeto2025_Salt_Key"; // Em produção, use um salt único por usuário
                var saltedPassword = password + salt;
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            var hashedInput = HashPassword(password);
            return hashedInput == hashedPassword;
        }
    }
}
