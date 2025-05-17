using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindMapBackend.Data.DTO;
using MindMapBackend.Infactucture.Interfaces;
using System.Security.Claims;

namespace MindMapBackend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ConnectionController : ControllerBase
    {
        private readonly IConnectionService _connectionService;

        public ConnectionController(IConnectionService connectionService)
        {
            _connectionService = connectionService;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null || !int.TryParse(claim.Value, out int userId))
            {
                throw new UnauthorizedAccessException("Пользователь не авторизован.");
            }
            return userId;
        }

        [HttpPost]
        public async Task<IActionResult> CreateConnection([FromBody] CreateConnectionDTO dto)
        {
            var userId = GetUserId();
            var connection = await _connectionService.CreateConnectionAsync(dto, userId);
            return Ok(connection);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConnection(int id)
        {
            var userId = GetUserId();
            await _connectionService.DeleteConnectionAsync(id, userId);
            return NoContent();
        }

        [HttpGet("map/{mindMapId}")]
        public async Task<IActionResult> GetConnectionsByMap(int mindMapId)
        {
            var userId = GetUserId();
            var connections = await _connectionService.GetConnectionsByMapIdAsync(mindMapId, userId);
            return Ok(connections);
        }
    }
}
