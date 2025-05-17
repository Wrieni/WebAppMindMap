namespace MindMapBackend.Data.DTO
{
    public class CreateConnectionDTO
    {
        public int SourceNodeId { get; set; }
        public int TargetNodeId { get; set; }
        public string Type { get; set; }
        public int MindMapId { get; set; }
    }
}
