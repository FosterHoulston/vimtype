import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    {
      name: "cross-origin-isolation",
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("cross-origin-opener-policy", "same-origin");
          res.setHeader("cross-origin-embedder-policy", "require-corp");
          next();
        });
      },
    },
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
