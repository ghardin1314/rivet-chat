import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema/*.ts",
  dialect: "postgresql",
  tablesFilter: ["!kv", "!conflict_ranges"],
  dbCredentials: {
    url: "postgresql://rivet:rivet_password@localhost:54320/rivet",
  },
});
