using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindMapBackend.Data.DTO;
using MindMapBackend.Data.Models;
using MindMapBackend.Infactucture.Interfaces;
using System.Security.Claims;

namespace MindMapBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            var result = await _authService.RegisterAsync(model);

            if (!result.Succeeded) { return BadRequest(result.Error); }

            return Ok(new
                {
                Token = result.Token,
                Message = "Регистрация успешна",
                User = result.User
                }
            );
        }


        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return Unauthorized("Пользователь не авторизован");

            if (!int.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized("Некорректный токен");

            var userDto = await _authService.GetProfileAsync(userId);

            if (userDto == null)
                return NotFound("Пользователь не найден");

            return Ok(userDto);
        }


    }
}
