using Microsoft.EntityFrameworkCore;
using MindMapBackend.Data.DTO;
using MindMapBackend.Data.Models;
using MindMapBackend.Infactucture.Interfaces;

namespace MindMapBackend.Infactucture.Services
{
    public class ConnectionService : IConnectionService
    {
        private readonly MindMapDbContext _context;

        public ConnectionService(MindMapDbContext context) => _context = context;

        public async Task<Connection> CreateConnectionAsync(CreateConnectionDTO dto, int userId)
        {
            // 1. Проверяем, что такая карта существует и принадлежит userId
            var map = await _context.MindMaps
                .FirstOrDefaultAsync(m => m.id == dto.MindMapId && m.userid == userId);
            if (map == null) throw new UnauthorizedAccessException("Нет доступа к карте");

            // 2. Проверяем, что оба узла принадлежат этой же карте
            var source = await _context.Nodes.FirstOrDefaultAsync(n => n.id == dto.SourceNodeId && n.mindmapid == map.id);
            var target = await _context.Nodes.FirstOrDefaultAsync(n => n.id == dto.TargetNodeId && n.mindmapid == map.id);
            if (source == null || target == null) throw new Exception("Узел не найден в этой карте");

            var connection = new Connection
            {
                mindmapid = map.id,
                sourcenodeid = source.id,
                targetnodeid = target.id,
                type = dto.Type
            };

            _context.Connections.Add(connection);
            await _context.SaveChangesAsync();
            return connection;
        }

        public async Task DeleteConnectionAsync(int id, int userId)
        {
            var conn = await _context.Connections
                .Include(c => c.mindmap)          
                .FirstOrDefaultAsync(c => c.id == id);

            if (conn == null) throw new KeyNotFoundException("Связь не найдена");
            if (conn.mindmap.userid != userId) throw new UnauthorizedAccessException();

            _context.Connections.Remove(conn);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Connection>> GetConnectionsByMapIdAsync(int mindMapId, int userId)
        {
            var map = await _context.MindMaps
                .FirstOrDefaultAsync(m => m.id == mindMapId && m.userid == userId);
            if (map == null) throw new UnauthorizedAccessException();

            return await _context.Connections
                .Where(c => c.mindmapid == mindMapId)
                .ToListAsync();
        }
    }

}
