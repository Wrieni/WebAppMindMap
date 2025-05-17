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

        public async Task ToggleVisibilityAsync(int mapId)
        {
            var map = await _context.MindMaps.FindAsync(mapId);
            if (map == null) throw new KeyNotFoundException("Карта не найдена");

            map.ispublic = !map.ispublic;
            await _context.SaveChangesAsync();
        }


    }
}
