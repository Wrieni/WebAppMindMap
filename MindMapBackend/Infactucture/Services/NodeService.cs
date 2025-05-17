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

        public NodeService(MindMapDbContext context)
        {
            _context = context;
        }

        public async Task<Node> CreateNodeAsync(int mindMapId, CreateNodeDTO node)
        {           
            if (mindMapId == 0 )
            {
                throw new Exception("Невозможно создать узел в несуществующей карте");
            }

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

        public async Task DeleteNodeAsync(int id)
        {
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

        public async Task<Node> GetNodeByIdAsync(int id)
        {
            return await _context.Nodes.FirstOrDefaultAsync(n => n.id == id);
        }

        public async Task UpdateNodeAsync(int id, Node node)
        {
            if (id != node.id) { throw new ArgumentException("ID узла не совпадает с переданным"); }
            _context.Entry(node).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}
