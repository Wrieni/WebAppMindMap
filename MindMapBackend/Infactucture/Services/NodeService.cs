using Microsoft.EntityFrameworkCore;
using MindMapBackend.Data.DTO;
using MindMapBackend.Data.Models;
using MindMapBackend.Infactucture.Interfaces;
using Org.BouncyCastle.Crypto.Macs;

namespace MindMapBackend.Infactucture.Services
{
    public class NodeService : INodeService
    {
        private readonly MindMapDbContext _context;
        private readonly IMindMapService _mindMapService;

        public NodeService(MindMapDbContext context, IMindMapService mindMapService)
        {
            _context = context;
            _mindMapService = mindMapService;
            
        }

        public async Task<Node> CreateNodeAsync(int mindMapId, int userId, CreateNodeDTO node)
        {           
            if (mindMapId == 0 )
            {
                throw new Exception("Невозможно создать узел в несуществующей карте");
            }
            var mindmap = await _mindMapService.GetMindMapByIdAsync(mindMapId);
            if (mindmap.userid != userId) { throw new Exception("Карта не принадлежит юзеру"); }

            var newnode = new Node {
                title = node.Title,
                description = node.Description,
                positionx = node.PositionX,
                positiony = node.PositionY,
                color = node.Color,
                mindmapid = mindMapId,
            };

            _context.Nodes.Add(newnode);
            await _context.SaveChangesAsync();
            return newnode;

        }

        public async Task DeleteNodeAsync(int id, int mindMapId, int userId)
        {
            var mindmap = await _mindMapService.GetMindMapByIdAsync(mindMapId);
            mindmap.EnsureOwner(userId);

            var node = await _context.Nodes.FindAsync(id);
            if (node == null)
                throw new KeyNotFoundException("Узел не найден");
            _context.Nodes.Remove(node);

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Node>> GetAllNodesAsync()
        {
            return await _context.Nodes.ToListAsync();
        }

        public async Task<Node> GetNodeByIdAsync(int id, int mindMapId, int userId)
        {
            var mindmap = await _mindMapService.GetMindMapByIdAsync(mindMapId);
            mindmap.EnsureOwner(userId);
            return await _context.Nodes.FindAsync(id);
        }

        public async Task UpdateNodeAsync(
                int nodeId,
                Node node,
                int mindMapId,
                int userId)
        {
            var existingNode = await _context.Nodes
                .FirstOrDefaultAsync(n => n.id == nodeId && n.mindmapid == mindMapId);

            existingNode.title = node.title;
            existingNode.description = node.description;
            existingNode.positionx = node.positionx; 
            existingNode.positiony = node.positiony;
            existingNode.color = node.color;

            await _context.SaveChangesAsync();
        }
        //public async Task UpdateNodeAsync(int id, Node node, int mindMapId, int userId)
        //{
        //    var mindmap = await _mindMapService.GetMindMapByIdAsync(mindMapId);
        //    mindmap.EnsureOwner(userId);
        //    if (id != node.id) { throw new ArgumentException("ID узла не совпадает с переданным"); }
        //    _context.Entry(node).State = EntityState.Modified;
        //    await _context.SaveChangesAsync();
        //}
    }
}
