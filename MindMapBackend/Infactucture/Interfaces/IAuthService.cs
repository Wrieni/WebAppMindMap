﻿using MindMapBackend.Data.DTO;
using MindMapBackend.Data.Models;

namespace MindMapBackend.Infactucture.Interfaces
{
    public interface IAuthService
    {
        public Task<AuthResult> AuthenticateAsync(string email, string password);
        public Task<AuthResult> RegisterAsync(RegisterDTO registerDto);
        Task<UserDTO?> GetProfileAsync(int userId);

    }
}
