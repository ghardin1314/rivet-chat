import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = 'postgresql://rivet:rivet_password@localhost:54320/rivet';

const client = postgres(connectionString);
export const db = drizzle(client);
