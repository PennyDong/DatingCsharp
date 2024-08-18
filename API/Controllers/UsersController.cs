using System.Collections;
using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
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
    private readonly IPhotoService _photoService;

    public UsersController(IUserRepository userRepository,IMapper mapper,IPhotoService photoService) 
    {
        //_context = context;
        _userRepository = userRepository;
        _mapper = mapper;
        _photoService = photoService;
    }

    [HttpGet]
    //[FromQuery]用途 這個參數應該從 HTTP 請求的查詢字符串中取得。
    //這個查詢字符串中的 pageNumber 和 pageSize 參數將會被綁定到 UserParams 類別的對應屬性中。
    public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
    {
        var currentUser = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
        userParams.CurrentUsername = currentUser.UserName;

        if(string.IsNullOrEmpty(userParams.Gender))
        {
            userParams.Gender = currentUser.Gender == "male"?"female":"male";
        }

        var users = await _userRepository.GetMembersAsync(userParams);

        Response.AddPaginationHeader(
            new PageinationHeader(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages));
       
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
        //var username = User.GetUsername();
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        if(user == null) return NotFound();
        _mapper.Map(memberUpdateDto,user);
        
        //儲存所有的異步資料，如果成功回傳狀態碼 204
        if(await _userRepository.SaveAllAsync()) return NoContent();

        //如果失敗回傳
        return BadRequest("Failed to update user");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        if(user == null) return NotFound();

        var result = await _photoService.AddPhotoAsync(file);

        if(result.Error != null) return BadRequest(result.Error.Message);

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };

        if(user.photos.Count ==0) photo.IsMain = true;

        user.photos.Add(photo);

        if(await _userRepository.SaveAllAsync()) //return _mapper.Map<PhotoDto>(photo); //測試用
        {
            return CreatedAtAction(nameof(GetUser)
            ,new {username = user.UserName}, _mapper.Map<PhotoDto>(photo));
        } 
        return BadRequest("Problem adding photo");
    }


    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        if(user == null) return NotFound();

        var photo = user.photos.FirstOrDefault(x => x.Id == photoId);

        if(photo == null) return NotFound();

        if(photo.IsMain) return BadRequest("this is already your main photo");

        var currentMain = user.photos.FirstOrDefault(x => x.IsMain);
        if(currentMain != null) currentMain.IsMain = false;
        photo.IsMain = true;

        if(await _userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Problem setting the main photo");
    }

    [HttpDelete("delete-photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        var photo = user.photos.FirstOrDefault(x=> x.Id == photoId);

        if(photo == null) return NotFound();

        if(photo.IsMain) return BadRequest("You cannot delete your main photo");

        if(photo.PublicId != null)
        {
            var result = await _photoService.DeletePhotoAsync(photo.PublicId);

            if(result.Error != null) return BadRequest(result.Error.Message);
        }

        user.photos.Remove(photo);

        if(await _userRepository.SaveAllAsync()) return Ok();
        return BadRequest("Problem deleting photo");
    }
}
