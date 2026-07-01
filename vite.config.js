import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";
import suidPlugin from "@suid/vite-plugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: '/tabledit/',
    // solid-devtools/vite already disables itself in production via apply().
    plugins: [devtools(), solidPlugin(), tailwindcss(), suidPlugin()],
    server: {
      port: parseInt(env.FRONTEND_PORT || "3000", 10),
    },
    build: {
      target: "esnext",
    },
  };
});

