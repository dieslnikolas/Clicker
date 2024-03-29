using System.Reflection;
using Clicker.Backend;
using Clicker.Backend.Common.ExceptionHandlers;
using Clicker.Backend.Common.Extensions;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Swagger
builder.Services.AddSwagger();
// Register MediatR
builder.Services.AddMediator();
// Authorization and Authentication
builder.Services.AddJWTSupport(builder.Configuration);
builder.Services.AddHttpContextAccessor();
// Register Automapper
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
// Register FluentValidations
builder.Services.AddValidators();
// API HTTP Request context
builder.Services.AddWebApi();
// Database
builder.Services.AddDb();
// Register Nlog
builder.Logging.ClearProviders().AddSerilog();
// CORS
var ClickerUI = "_ClickerUICorsName";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: ClickerUI,
        policy =>
        {
            policy.AllowAnyOrigin();
            policy.AllowAnyMethod();
            policy.AllowAnyHeader();
        });
});

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
app.UseExceptionHandler(handler => handler.Run(async ctx => await ExceptionHandler.Handle(ctx)));

// CORS
app.UseCors(ClickerUI);

// Add authorization/Authentication
app.UseAuthentication();
app.UseAuthorization();

// HTTPS
app.UseHttpsRedirection();


// RUN API
app.Run();