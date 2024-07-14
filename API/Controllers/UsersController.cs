using System.Collections;
using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

// /api/users
  [Authorize]
public class UsersController:BaseApiController
{
    //private readonly DataContext _context;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UsersController(IUserRepository userRepository,IMapper mapper) 
    {
        //_context = context;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    [HttpGet]
 
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
       
        var users = await _userRepository.GetMembersAsync();

       
        return Ok(users);
    }

    
    [HttpGet("{username}")]// /api/users/username
  
    public async Task <ActionResult<MemberDto>> GetUser(string username)
    {
        return await _userRepository.GetMemberAsync(username);

    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {   //防止.FindFirst() 出現錯誤 所以使用 ? 來表示參數可以是null
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _userRepository.GetUserByUsernameAsync(username);

        if(user == null) return NotFound();
        _mapper.Map(memberUpdateDto,user);
        
        //儲存所有的異步資料，如果成功回傳狀態碼 204
        if(await _userRepository.SaveAllAsync()) return NoContent();

        //如果失敗回傳
        return BadRequest("Failed to update user");
    }
}
