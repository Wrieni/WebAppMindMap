using Microsoft.EntityFrameworkCore;
using MindMapBackend.Data.DTO;
using MindMapBackend.Data.Models;
using MindMapBackend.Infactucture.Interfaces;

namespace MindMapBackend.Infactucture.Services
{
    public class MindMapService : IMindMapService
    {
        private readonly MindMapDbContext _context;
        public MindMapService(MindMapDbContext context)
        {
            _context = context;
        }
        public async Task<MindMap> CreateMindMapAsync(int userId, CreateMindMapDTO map)
        {
            if (userId == 0) { throw new Exception("Невозможно создать карту для несуществующего юзера"); }
            var newMap = new MindMap
            {
                title = map.Title,
                ispublic = map.ispublic,
                createdat = DateTime.Now,
                userid = userId,
                Nodes = new List<Node>
                    {
                        new Node
                        {
                            title = "Главная тема",
                            positionx= 300,
                            positiony = 300,

                        }
                    }
            };

            _context.Add(newMap);
            await _context.SaveChangesAsync();
            return newMap;
        }

        public async Task DeleteMindMapAsync(int id, int userId)
        {
            var mindmap = await _context.MindMaps.FindAsync(id);
            mindmap.EnsureOwner(userId);
            var node = await _context.MindMaps.FindAsync(id);
            if (node == null)
            {
                throw new KeyNotFoundException("Карты с таким ID не существует");
            }
            _context.Remove(node);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<MindMap>> GetAllMindMapsAsync()
        {
            return await _context.MindMaps.ToListAsync();
        }

        public async Task<MindMap> GetMindMapByIdAsync(int id)
        {
            return await _context.MindMaps.FindAsync(id);

        }
     
        //public async Task<MindMapResponse> GetMindMapWithNodesAndConnectionsAsync(int mapId, int userId)
        //{
        //    var map = await _context.MindMaps
        //        .Include(m => m.Nodes)
        //        .Include(m => m.Connections)
        //        .FirstOrDefaultAsync(m => m.id == mapId && m.userid == userId);

        //    if (map == null) throw new KeyNotFoundException("Карта не найдена");
        //    if (map.userid != userId)
        //        throw new UnauthorizedAccessException("У вас нет прав на просмотр этой карты.");

        //    return new MindMapResponse
        //    {
        //        Id = map.id,
        //        Title = map.title,
        //        Nodes = (List<Node>)map.Nodes,
        //        Connections = (List<Connection>)map.Connections
        //    };
        //}

        public async Task<MindMapResponse> GetMindMapWithNodesAndConnectionsAsync(int mapId, int userId)
        {
            var map = await _context.MindMaps
                .Include(m => m.Nodes)
                .Include(m => m.Connections)
                .FirstOrDefaultAsync(m => m.id == mapId && m.userid == userId);

            if (map == null) throw new KeyNotFoundException("Карта не найдена");

            return new MindMapResponse
            {
                Id = map.id,
                Title = map.title,
                IsPublic = map.ispublic,
                Nodes = map.Nodes.Select(n => new NodeResponseDTO
                {
                    Id = n.id,
                    Title = n.title,
                    Description = n.description,
                    PositionX = n.positionx,
                    PositionY = n.positiony,
                    Color = n.color
                }).ToList(),
                Connections = map.Connections.Select(c => new ConnectionResponseDTO
                {
                    Id = c.id,
                    FromNodeId = c.sourcenodeid,
                    ToNodeId = c.targetnodeid,
                }).ToList()
            };
        }

        public async Task<IEnumerable<MindMap>> GetMindMapByUserIdAsync(int userId)
        {
            if (userId == 0)
            {
                throw new KeyNotFoundException("Юзера с таким ID не существует");
            }

            return await _context.MindMaps
                .Where(m => m.userid == userId)
                .ToListAsync();
        }

        public async Task UpdateMindMapAsync(int id, MindMap map, int userId)
        {
            map.EnsureOwner(userId);
            if (id != map.id) { throw new Exception("Id передаваемой карты не сооветствует"); }
            _context.Entry(map).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task ToggleVisibilityAsync(int mapId, int userId)
        {
            var map = await _context.MindMaps.FindAsync(mapId);
            if (map == null) throw new KeyNotFoundException("Карта не найдена");
            map.EnsureOwner(userId);

            map.ispublic = !map.ispublic;
            await _context.SaveChangesAsync();
        }


    }
}
