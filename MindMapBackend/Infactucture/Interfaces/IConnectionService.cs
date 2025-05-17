using MindMapBackend.Data.DTO;
using MindMapBackend.Data.Models;

namespace MindMapBackend.Infactucture.Interfaces
{
    public interface IConnectionService
    {
        Task<Connection> CreateConnectionAsync(CreateConnectionDTO dto, int userId);
        Task DeleteConnectionAsync(int id, int userId);
        Task<IEnumerable<Connection>> GetConnectionsByMapIdAsync(int mindMapId, int userId);
    }
}
