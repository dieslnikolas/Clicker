using System;
using MediatR;

namespace Clicker.Api.Endpoints
{
	public class Module : IEndpoint
	{

        /// <inheritdoc />
        public void Register(WebApplication app)
        {
            // URLS
            app.MapGet("/Get", (IMediator mediator) => {  });
            app.MapPost("/Create", () => {  });
            app.MapPost("/Edit", () => {  });
            app.MapPost("/Delete", () => {  });
        }
    }
}

