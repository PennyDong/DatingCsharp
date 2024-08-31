using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike> Likes{ get; set; }
    public DbSet<Message> Messages { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {   //此句為必須語句，不添加會在操作時出現錯誤。
        base.OnModelCreating(builder);

        builder.Entity<UserLike>()
            .HasKey(k => new {k.SourceUserId,k.TargetUserId});
        
        builder.Entity<UserLike>()
            .HasOne( s => s.SourceUser)
            .WithMany( l => l.LikedUsers)
            .HasForeignKey( s => s.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserLike>()
            .HasOne( s => s.TargetUser)
            .WithMany( l => l.LikedByUsers)
            .HasForeignKey( s => s.TargetUserId)
            .OnDelete(DeleteBehavior.Cascade); //.OnDelete(DeleteBehavior.NoAction); 如果使用 MSSQL 須改使用此句

        builder.Entity<Message>()
            .HasOne(u => u.Recipient)
            .WithMany(m => m.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Message>()
            .HasOne(u => u.Sender)
            .WithMany(m => m.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
