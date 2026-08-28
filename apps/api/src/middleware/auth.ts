import { createMiddleware } from "hono/factory";
import { HttpError } from "../lib/http.js";

// auth inicialmente usando API secret, deve mover para JWT com autenticacao login e senha de usuario
// TODO: Integrar o https://clerk.com no apps/web e apps/api
export const apiAuth = createMiddleware(async (c, next) => {
  const secret = process.env.SAVECAMP_API_SECRET;
  if (!secret) {
    await next();
    return;
  }

  const authorization = c.req.header("Authorization");
  if (authorization !== `Bearer ${secret}`) {
    throw new HttpError(401, "Unauthorized");
  }

  await next();
});
