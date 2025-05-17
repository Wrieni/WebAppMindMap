using MindMapBackend.Data.DTO;
using MindMapBackend.Data.Models;

namespace MindMapBackend.Infactucture.Interfaces
{
    public interface INodeService
    {
        Task<IEnumerable<Node>> GetAllNodesAsync();
        Task<Node> GetNodeByIdAsync(int id, int mindMapId, int userId);
        Task<Node> CreateNodeAsync(int mindMapId, int userId, CreateNodeDTO node);
        Task UpdateNodeAsync(int id, Node node, int mindMapId, int userId);
        Task DeleteNodeAsync(int id, int mindMapId, int userId);

    }
}
