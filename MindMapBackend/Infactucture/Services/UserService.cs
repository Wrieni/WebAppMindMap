using Microsoft.EntityFrameworkCore;
using MindMapBackend.Data.Models;
using MindMapBackend.Infactucture.Interfaces;

namespace MindMapBackend.Infactucture.Services
{
    public class UserService : IUserService
    {
        private readonly MindMapDbContext _dbContext;

        public UserService(MindMapDbContext context)
        {
            _dbContext = context;
            
        }

        public async Task<User> CreateUserAsync(User user)
        {
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _dbContext.Users.ToListAsync();

            
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _dbContext.Users.FindAsync(userId);
        }
    }
}
