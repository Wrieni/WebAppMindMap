using Microsoft.AspNetCore.Mvc;
using MindMapBackend.Data.DTO;
using MindMapBackend.Infactucture.Interfaces;

namespace MindMapBackend.Controllers
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            var result = await _authService.AuthenticateAsync(model.email, model.password);

            if (!result.Succeeded) { return Unauthorized(result.Error); }
            return Ok(new
            {
                Token = result.Token,
                Message = "Вход успешно выполнен",
                User = result.User,
            }                
            );
        }
    }
}
