using System;
using MediatR;

namespace Clicker.Api.Endpoints
{
    public class Script : IEndpoint
    {
        /// <inheritdoc />
        public void Register(WebApplication app)
        {
            // URLS
            app.MapGet("/Get", () => { });
            app.MapPost("/Create", () => { });
            app.MapPost("/Edit", () => { });
            app.MapPost("/Delete", () => { });
        }
    }
}

