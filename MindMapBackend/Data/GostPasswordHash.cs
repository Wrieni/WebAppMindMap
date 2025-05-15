using Org.BouncyCastle.Crypto.Digests;
using Org.BouncyCastle.Crypto;
using System.Security.Cryptography;
using System.Text;

namespace MindMapBackend.Data
{
    

    public static class GostPasswordHasher
    {
        private const int SaltSize = 32; 
        private const int Iterations = 10000;
        private const int HashSize = 32;

        public static string HashPassword(string password)
        {
            
            byte[] salt = new byte[SaltSize];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            
            byte[] hash = ComputeGostHash(password, salt, Iterations);

            
            byte[] hashBytes = new byte[SaltSize + HashSize];
            Array.Copy(salt, 0, hashBytes, 0, SaltSize);
            Array.Copy(hash, 0, hashBytes, SaltSize, HashSize);

            return Convert.ToBase64String(hashBytes);
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
           
            byte[] hashBytes = Convert.FromBase64String(hashedPassword);
            byte[] salt = new byte[SaltSize];
            Array.Copy(hashBytes, 0, salt, 0, SaltSize);

            byte[] storedHash = new byte[HashSize];
            Array.Copy(hashBytes, SaltSize, storedHash, 0, HashSize);
            byte[] computedHash = ComputeGostHash(password, salt, Iterations);


            return SlowEquals(storedHash, computedHash);
        }

        

        private static byte[] ComputeGostHash(string password, byte[] salt, int iterations)
        {
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
            byte[] combined = new byte[passwordBytes.Length + salt.Length];
            Buffer.BlockCopy(passwordBytes, 0, combined, 0, passwordBytes.Length);
            Buffer.BlockCopy(salt, 0, combined, passwordBytes.Length, salt.Length);

            var digest = new Gost3411_2012_512_BC();
            byte[] hash = new byte[digest.GetDigestSize()];

            for (int i = 0; i < iterations; i++)
            {
                digest.BlockUpdate(combined, 0, combined.Length);
                digest.DoFinal(hash, 0);
                combined = hash; 
            }

            return hash;
        }

        private static bool SlowEquals(byte[] a, byte[] b)
        {
            uint diff = (uint)a.Length ^ (uint)b.Length;
            for (int i = 0; i < a.Length && i < b.Length; i++)
            {
                diff |= (uint)(a[i] ^ b[i]);
            }
            return diff == 0;
        }
    }


    public class Gost3411_2012_512_BC : IDigest
    {
        private readonly Gost3411_2012_256Digest _digest;

        public Gost3411_2012_512_BC()
        {
            
            _digest = new Gost3411_2012_256Digest();
        }

        public string AlgorithmName => "GOST3411-2012-256"; 

        public int GetDigestSize() => 32; 

        public int GetByteLength() => _digest.GetByteLength();

        public void Update(byte input) => _digest.Update(input);

        public void BlockUpdate(byte[] input, int inOff, int length)
            => _digest.BlockUpdate(input, inOff, length);

        public int DoFinal(byte[] output, int outOff)
            => _digest.DoFinal(output, outOff);

        public void Reset() => _digest.Reset();
    }

}
