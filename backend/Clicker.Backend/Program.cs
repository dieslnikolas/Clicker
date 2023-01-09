using System.Reflection;
using Clicker.Backend;
using Clicker.Backend.Common;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Swagger
builder.Services.AddSwagger();
// Register MediatR
builder.Services.AddMediator();
// Authorization and Authentication
builder.Services.AddAuthorization(builder.Configuration);
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

// Exception handler
app.UseExceptionHandler(handler => handler.Run(async ctx => await ErrorHandler.Handle(ctx)));

// Add authorization/Authentication
app.UseAuthentication();
app.UseAuthorization();

// HTTPS
app.UseHttpsRedirection();

// RUN API
app.Run();