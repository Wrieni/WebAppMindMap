using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindMapBackend.Data;
using MindMapBackend.Data.DTO;
using MindMapBackend.Data.Models;
using MindMapBackend.Infactucture.Interfaces;

namespace MindMapBackend.Infactucture.Services
{
    public class AuthService : IAuthService
    {
        private readonly MindMapDbContext _context;
        private readonly JwtService _jwtService;

        public AuthService(MindMapDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }
        public async Task<AuthResult> AuthenticateAsync(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email);

            if (user == null || !GostPasswordHasher.VerifyPassword(password, user.password))
            {
                return AuthResult.Failure("Неверная почта или пароль");
            }

            var token = _jwtService.GenerateJwtToken(user);

            return AuthResult.Success(token, new UserDTO {
                Email = user.email,
                Name = user.name,
                Surname = user.surname,
                Role = user.role
            });

        }

        public Task<User> Register(User user)
        {
            throw new NotImplementedException();
        }
    }
}
