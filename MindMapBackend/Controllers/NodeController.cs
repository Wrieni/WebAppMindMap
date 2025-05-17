using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindMapBackend.Data.DTO;
using MindMapBackend.Infactucture.Interfaces;
using System.Security.Claims;

namespace MindMapBackend.Controllers
{
    

    namespace MindMapBackend.Controllers
    {
        [Authorize]
        [ApiController]
        [Route("api/[controller]")]
        public class NodeController : ControllerBase
        {
            private readonly INodeService _nodeService;

            public NodeController(INodeService nodeService)
            {
                _nodeService = nodeService;
            }

            //метод для извлечения userId из токена
            private int GetUserId()
            {
                var claim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (claim == null || !int.TryParse(claim.Value, out int userId))
                {
                    throw new UnauthorizedAccessException("Пользователь не авторизован.");
                }
                return userId;
            }

            [HttpPost("{mindMapId}")]
            public async Task<IActionResult> CreateNode(int mindMapId, [FromBody] CreateNodeDTO dto)
            {
                int userId = GetUserId();
                var result = await _nodeService.CreateNodeAsync(mindMapId, userId, dto);
                return Ok(result);
            }

            [HttpPut("{nodeId}/mindmap/{mindMapId}")]
            public async Task<IActionResult> UpdateNode(int nodeId, int mindMapId, [FromBody] CreateNodeDTO dto)
            {
                int userId = GetUserId();
                var node = new Data.Models.Node
                {
                    id = nodeId,
                    title = dto.Title,
                    description = dto.Description,
                    positionx = dto.PositionX,
                    positiony = dto.PositionY,
                    color = dto.Color,
                    mindmapid = mindMapId
                };

                await _nodeService.UpdateNodeAsync(nodeId, node, mindMapId, userId);
                return NoContent();
            }

            [HttpDelete("{nodeId}/mindmap/{mindMapId}")]
            public async Task<IActionResult> DeleteNode(int nodeId, int mindMapId)
            {
                int userId = GetUserId();
                await _nodeService.DeleteNodeAsync(nodeId, mindMapId, userId);
                return NoContent();
            }
        }
    }


}
