using System.Security.Cryptography;
using System.Text;

namespace Service
{
    public static class SecurePasswordHashService
    {
        private const int SaltSize = 32;
        private const int HashSize = 32;
        private const int Iterations = 100000; // PBKDF2 iterations

        public static string HashPassword(string password)
        {
            // Generate a random salt
            var salt = new byte[SaltSize];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // Hash the password with the salt
            using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256))
            {
                var hash = pbkdf2.GetBytes(HashSize);
                
                // Combine salt and hash
                var hashBytes = new byte[SaltSize + HashSize];
                Array.Copy(salt, 0, hashBytes, 0, SaltSize);
                Array.Copy(hash, 0, hashBytes, SaltSize, HashSize);
                
                return Convert.ToBase64String(hashBytes);
            }
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            try
            {
                var hashBytes = Convert.FromBase64String(hashedPassword);
                
                // Extract salt
                var salt = new byte[SaltSize];
                Array.Copy(hashBytes, 0, salt, 0, SaltSize);
                
                // Extract hash
                var hash = new byte[HashSize];
                Array.Copy(hashBytes, SaltSize, hash, 0, HashSize);
                
                // Hash the input password with the extracted salt
                using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256))
                {
                    var testHash = pbkdf2.GetBytes(HashSize);
                    return CryptographicOperations.FixedTimeEquals(hash, testHash);
                }
            }
            catch
            {
                return false;
            }
        }
    }
}
