using MindMapBackend.Data.Models;

namespace MindMapBackend.Data.DTO
{   
    public class MindMapResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool IsPublic { get; set; }
        public List<NodeResponseDTO> Nodes { get; set; } = new();
        public List<ConnectionResponseDTO> Connections { get; set; } = new();
    }
}
