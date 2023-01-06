using System.Reflection;
using Clicker.Backend;
using Clicker.Backend.Common;
using Clicker.Backend.Endpoints;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Register MediatR
builder.Services.AddMediator();
// Register Automapper
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
// Register FluentValidations
builder.Services.AddValidators();
// API HTTP Request context
builder.Services.AddApi();
// Register Nlog
builder.Logging.ClearProviders().AddSerilog();

var app = builder.Build();

// Register endpoints
app.RegisterEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.Run();