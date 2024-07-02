using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

// /api/users
[Authorize]
public class UsersController:BaseApiController
{

    private readonly IUserRepository _userRepository;
    public UsersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
    {   
        //不使用注入時使用的
        //var users = await _context.Users.ToListAsync();
        //return users;
        
        return Ok(await _userRepository.GetUsersAsync());
    }

    
    [HttpGet("{username}")]// /api/users/username
    public async Task<ActionResult<AppUser>> GetUser(string username)
    {
        //return _context.Users.Find(username);
        return await _userRepository.GetUserByUsernameAsync(username);
    }
}
