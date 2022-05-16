import { env } from "./application/environment/env";
import { App } from "./application/application";
import { middleware } from "./application/middleware";
import { router } from "./application/routes/project.router";

const port: number = env().port ?? 8080;

/**
 * Configure App instance
 */
const app = new App(
  port,
  middleware,
  [router] //* Add your express router objects here
);

/**
 * Launch!
 */
app.listen();
