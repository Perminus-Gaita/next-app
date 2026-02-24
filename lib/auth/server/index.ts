import { betterAuth } from "better-auth";
import config from "./config";
import plugins from "./plugins";
import databaseHooks from "./database-hooks";

export const auth = betterAuth({
  ...config,
  plugins,
  databaseHooks,
});
