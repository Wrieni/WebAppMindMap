using MindMapBackend.Data.Models;

namespace MindMapBackend.Infactucture.Interfaces
{
    public interface IUserService
    {
        public Task<IEnumerable<User>> GetAllUsersAsync();
        public Task<User> GetUserByIdAsync(int userId);

        public Task<User> CreateUserAsync(User user);

    }
}
