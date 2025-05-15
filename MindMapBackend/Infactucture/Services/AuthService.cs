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

        public async Task<AuthResult> RegisterAsync(RegisterDTO registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.email == registerDto.email)) {
                return AuthResult.Failure("Пользователь с такой почтой уже существует");         
            }

            var user = new User
            {
                name = registerDto.name,
                email = registerDto.email,
                password = GostPasswordHasher.HashPassword(registerDto.password),
                surname = registerDto.surname,
                role = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateJwtToken(user);
            return AuthResult.Success(token, new UserDTO
            {
                Email = user.email,
                Name = user.name,
                Surname = user.surname,
                Role = user.role
            });
        }
    }
}
