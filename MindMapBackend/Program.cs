using Microsoft.EntityFrameworkCore;
using MindMapBackend.Data.Models;
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<MindMapDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddCors(options => {
    options.AddPolicy("ReactPolicy", policy => {
        policy.WithOrigins("http://localhost:5173") // Порт Vite по умолчанию
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("ReactPolicy");
app.MapWhen(ctx => !ctx.Request.Path.StartsWithSegments("/api"), b => b.UseHttpsRedirection());

app.MapGet("/api/test", () => "Hello from ASP.NET!");
app.MapControllers();

app.Run();

