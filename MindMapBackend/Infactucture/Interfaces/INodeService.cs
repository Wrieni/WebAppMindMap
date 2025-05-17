using MindMapBackend.Data.DTO;
using MindMapBackend.Data.Models;

namespace MindMapBackend.Infactucture.Interfaces
{
    public interface INodeService
    {
        Task<IEnumerable<Node>> GetAllNodesAsync();
        Task<Node> GetNodeByIdAsync(int id);
        Task<Node> CreateNodeAsync(int mindMapId, CreateNodeDTO node);
        Task UpdateNodeAsync(int id, Node node);
        Task DeleteNodeAsync(int id);

    }
}
