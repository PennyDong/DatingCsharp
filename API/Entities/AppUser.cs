namespace API.Entities;

public class AppUser
{
    //使用Id的話，會自動成為主鍵。
    //或使用[Key]來決定。

    public int Id { get; set; }
    public string UserName { get; set; }
}
