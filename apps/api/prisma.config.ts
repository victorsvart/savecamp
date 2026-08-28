/// <reference types="node" />
import { env, loadEnvFile } from "node:process";
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

try {
  loadEnvFile(new URL("./.env", import.meta.url));
} catch {
  // DATABASE_URL can come from the shell instead
}

export default definePrismaConfig({
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
  orm: ormConfig({
    contract: "./src/prisma/contract.prisma",
    db: {
      connection: env.DATABASE_URL!,
    },
    migrations: {
      dir: "migrations",
    },
  }),
});
