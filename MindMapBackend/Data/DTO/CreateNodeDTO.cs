namespace MindMapBackend.Data.DTO
{
    public class CreateNodeDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public double PositionX { get; set; }
        public double PositionY { get; set; }
        public string Color { get; set; }
        public bool? ispublic { get; set; }
    }
}
