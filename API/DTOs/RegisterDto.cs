using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string KnownAs { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        //設為可以為空的原因是因為這樣才能確認使用者是否是自己填寫日期
        //確保是給予正確的出身年月
        //而不是系統預設的日期
        public DateOnly? DateOfBirth { get; set; } //optional to make required work!
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        [StringLength(8,MinimumLength =4)]
        public string Password { get; set; }
    }
}