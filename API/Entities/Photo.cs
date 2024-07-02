using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Photos")]
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; }

        //建立與AppUser間的關聯
        public int AppUserId { get; set; }
        public AppUser AppUser { get; set; }
    }
}