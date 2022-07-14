using System;
using System.Reflection;
using Clicker.Api.Endpoints;
using MediatR;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Clicker.Api.Common
{
	public class DependencyInjection
	{
		private DependencyInjection() {}

        /// <summary>
        /// Register dependencies
        /// </summary>
        /// <param name="builder"></param>
        public static void Register(WebApplicationBuilder builder)
        {
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // MediatR
            builder.Services.AddMediatR(typeof(IEndpoint));

            // Endpoints
            builder.Services.AddScoped(typeof(IEndpoint), typeof(Api.Endpoints.Module));
            builder.Services.AddScoped(typeof(IEndpoint), typeof(Program));
            builder.Services.AddScoped(typeof(IEndpoint), typeof(Script));

            // Commands

            // Queries
        }
    }
}

