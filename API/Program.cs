using API.Extensions;
using API.Middleware;

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

app.Run();
