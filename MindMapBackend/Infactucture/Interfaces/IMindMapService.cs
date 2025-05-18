using MindMapBackend.Data.DTO;
using MindMapBackend.Data.Models;

namespace MindMapBackend.Infactucture.Interfaces
{
    public interface IMindMapService
    {
        Task<IEnumerable<MindMap>> GetAllMindMapsAsync();
        Task<MindMap> GetMindMapByIdAsync(int id);
        Task<MindMapResponse> GetMindMapWithNodesAndConnectionsAsync(int mapId, int userId);
        Task<IEnumerable<MindMap>> GetMindMapByUserIdAsync(int userId);
        Task<MindMap> CreateMindMapAsync(int userId, CreateMindMapDTO map);
        Task UpdateMindMapAsync(int id, MindMap map, int userId);
        Task DeleteMindMapAsync(int id, int userId);
        Task ToggleVisibilityAsync(int mapId, int userId);

    }
}
