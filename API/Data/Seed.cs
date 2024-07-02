using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext context)
        {
            //檢查數據庫中是否已經存在數據，如果有直接返回
            if(await context.Users.AnyAsync()) return;

            //如果沒有指定路徑檔案
            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            //PropertyNameCaseInsensitive 是否區分大小寫
            var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData,options);

            foreach(var user in users)
            {
                using var hmac = new HMACSHA512();

                user.UserName = user.UserName.ToLower();

                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));

                user.PasswordSalt = hmac.Key;

                context.Users.Add(user);
            }

            await context.SaveChangesAsync();
        }
        
    }
}