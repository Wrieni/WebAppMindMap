using MindMapBackend.Data.Models;

namespace MindMapBackend.Infactucture
{
    public static class AccessHelper
    {
        public static void EnsureOwner(this MindMap map, int userId)
        {
            if (map.userid != userId)
                throw new UnauthorizedAccessException("Карта не принадлежит пользователю");
        }
    }

}
