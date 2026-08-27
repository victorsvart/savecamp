import { createMiddleware } from "hono/factory";

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
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
});
