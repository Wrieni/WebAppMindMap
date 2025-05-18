using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindMapBackend.Data.DTO;
using MindMapBackend.Data.Models;
using MindMapBackend.Infactucture.Interfaces;
using System.Security.Claims;
using System.Text.Json;

namespace MindMapBackend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MindMapController : ControllerBase
    {
        private readonly IMindMapService _mindMapService;

        public MindMapController(IMindMapService mindMapService)
        {
            _mindMapService = mindMapService;
        }

        private int GetUserId()
        {
            
            
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                throw new UnauthorizedAccessException("Пользователь не авторизован.");
            }
            var userIdString = claim.Value;
            if (!int.TryParse(claim.Value, out int userId))
            {
                throw new UnauthorizedAccessException("Некорректный формат ID пользователя.");
            }

            return userId;
        }


        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetMindMap(int id)
        //{
        //    var userId = GetUserId();
        //    var map = await _mindMapService.GetMindMapWithNodesAndConnectionsAsync(id, userId);
        //    return Ok(map);
        //}

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMindMap(int id)
        {
            try
            {
                var userId = GetUserId();
                var map = await _mindMapService.GetMindMapWithNodesAndConnectionsAsync(id, userId);
                return Ok(map);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUserMaps()
        {
            var userId = GetUserId();
            var maps = await _mindMapService.GetMindMapByUserIdAsync(userId);
            return Ok(maps);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMap([FromBody] CreateMindMapDTO dto)
        {
            var userId = GetUserId();
            var result = await _mindMapService.CreateMindMapAsync(userId, dto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMap(int id, [FromBody] CreateMindMapDTO dto)
        {
            var userId = GetUserId();

            var map = new MindMap
            {
                id = id,
                title = dto.Title,
                ispublic = (bool)dto.ispublic,
                userid = userId
            };

            await _mindMapService.UpdateMindMapAsync(id, map, userId);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMap(int id)
        {
            var userId = GetUserId();
            await _mindMapService.DeleteMindMapAsync(id, userId);
            return NoContent();
        }

        [HttpPost("{id}/toggle-visibility")]
        public async Task<IActionResult> ToggleVisibility(int id)
        {
            var userId = GetUserId();
            await _mindMapService.ToggleVisibilityAsync(id, userId);
            return NoContent();
        }
    }
}
