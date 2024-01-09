import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

export default defineConfig((configEnv) => {
  const env = loadEnv(configEnv.mode, process.cwd(), "");

  console.log("\n\nENV\n\n");
  console.log(env);
  console.log("\n\nENV\n\n");
  console.log(process.env);
  console.log("\n\nENV\n\n");

  return {
    plugins: [react()],
    base: env.BASE_URL ?? "/",
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        app: resolve(__dirname, "src", "app"),
        components: resolve(__dirname, "src", "components"),
        hooks: resolve(__dirname, "src", "hooks"),
      },
    },
  };
});
