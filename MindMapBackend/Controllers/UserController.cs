using Microsoft.AspNetCore.Mvc;
using MindMapBackend.Data.DTO;
using MindMapBackend.Data.Models;
using MindMapBackend.Infactucture.Interfaces;
using System.Runtime.CompilerServices;

namespace MindMapBackend.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class UserController : ControllerBase
    {
    
        private readonly IUserService _userService;
        public UserController(IUserService userService) {
        
            _userService = userService;
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return users.ToList();
        }

        [HttpPost("createuser")]
        public async Task<ActionResult<User>> CreateUser(User model)
        {
            var createdUser = await _userService.CreateUserAsync(model);
            return Ok(createdUser); 
        }
    }
}
