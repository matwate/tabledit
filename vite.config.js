import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: env.VITE_BASE || "/tabledit/",
    plugins: [react(), tailwindcss()],
    server: {
      port: parseInt(env.FRONTEND_PORT || "3000", 10),
    },
    build: {
      target: "esnext",
    },
  };
});
