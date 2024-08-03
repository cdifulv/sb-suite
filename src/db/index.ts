/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

const globalForDb = globalThis as unknown as {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(process.env.POSTGRES_URL!);
if (process.env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
