import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";
import suidPlugin from "@suid/vite-plugin";

export default defineConfig({
  base: '/tabledit/',
  plugins: [devtools(), solidPlugin(), tailwindcss(), suidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
