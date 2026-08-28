import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const rendererOutDir = path.resolve(import.meta.dirname, "../desktop/renderer");
const apiOrigin = new URL(
  process.env.VITE_SAVECAMP_API_URL ?? "http://localhost:3000"
).origin;

function productionCsp(): Plugin {
  return {
    name: "production-csp",
    transformIndexHtml(html, ctx) {
      if (ctx.server) {
        return html;
      }

      return html.replace(
        "<head>",
        `<head>\n    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' ${apiOrigin}" />`
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), productionCsp()],
  build: {
    outDir: rendererOutDir,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
