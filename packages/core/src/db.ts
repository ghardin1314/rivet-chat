import * as schema from "./schema";

import { drizzle } from "drizzle-orm/node-postgres";

const connectionString =
  "postgresql://rivet:rivet_password@localhost:54320/rivet";

export const db = drizzle(connectionString, { schema });
