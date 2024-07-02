using API.Data;
using API.Extensions;
using API.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddApplicationServices(builder.Configuration);
//JWT
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// if(builder.Environment.IsDevelopment())
// {
//     app.UseDeveloperExceptionPage();
// }


// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(builder =>builder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));

//app.UseHttpsRedirection();

app.UseAuthentication(); //身分認證是否為有效的token
app.UseAuthorization(); //

app.MapControllers();

//訪問所有應用程序
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    //資料庫創建Table
    await context.Database.MigrateAsync();
    await Seed.SeedUsers(context);
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex,"An error occurred during migration");
}

app.Run();
