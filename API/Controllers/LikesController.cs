using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController :BaseApiController
    {
        private readonly ILikesReoisitory _likesReoisitory;
        private readonly IUserRepository _userRepository;
        public LikesController(IUserRepository userRepository, ILikesReoisitory likesReoisitory)
        {
            _likesReoisitory = likesReoisitory;
            _userRepository = userRepository;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await _userRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _likesReoisitory.GetUserWithLikes(sourceUserId);

            if(likedUser == null) return NotFound();
            if(sourceUser.UserName == username) return BadRequest("You cannot like yourself");

            var userLike = await _likesReoisitory.GetUserLike(sourceUserId, likedUser.Id);

            if(userLike != null) return BadRequest("You already like this user");

            userLike = new Entities.UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = likedUser.Id
            };

            sourceUser.LikedUsers.Add(userLike);

            if(await _userRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to like user");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
        {
            likesParams.UserId = User.GetUserId();

            var users = await _likesReoisitory.GetUserLikes(likesParams);

            Response.AddPaginationHeader(new PageinationHeader(
                users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages));

            return Ok(users);
        }
    }
}