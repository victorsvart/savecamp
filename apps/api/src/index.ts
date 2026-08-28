import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { AppId } from "@savecamp/types";
import { savesRoutes } from "./domains/saves/routes.js";
import { error } from "./lib/http.js";
import { apiAuth } from "./middleware/auth.js";

export const APP_ID: AppId = "api";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "hello from savecamp api" });
});

app.use(
  "/v1/*",
  cors({
    origin: "*",
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  })
);
app.use("/v1/saves/*", apiAuth);
app.route("/v1/saves", savesRoutes);

app.onError((err, c) => {
  console.error(err);
  return error(c, err);
});

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT ?? 3000),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
