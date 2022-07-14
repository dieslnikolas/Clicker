using Clicker.Api.Common;

// APP Builder
var builder = WebApplication.CreateBuilder(args);

// DI
DependencyInjection.Register(builder);

// Create app and setup 
var app = builder.Build();
AppHelper.SetUp(app);

// Register Endpoins
Endpoints.Register(app);

// start api
app.Run();