using System;

namespace Clicker.Api.Common
{
	public class AppHelper
	{
		private AppHelper() {	}

        public static void SetUp(WebApplication app)
        {
            // SWAGGER
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // HTTPS
            app.UseHttpsRedirection();
        }
    }
}

