import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { AppId } from "@savecamp/types";
import { apiAuth } from "./middleware/auth.js";
import { savesRoutes } from "./routes/saves.js";

export const APP_ID: AppId = "api";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.use("/v1/saves/*", apiAuth);
app.route("/v1/saves", savesRoutes);

app.onError((error, c) => {
  console.error(error);
  return c.json(
    { error: error instanceof Error ? error.message : "Internal server error" },
    500
  );
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
