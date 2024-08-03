import { loadEnvConfig } from '@next/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const sql = postgres(process.env.POSTGRES_URL!, { max: 1 });

const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: './src/db/migrations'
    });

    console.log('Migration successful');
  } catch (error) {
    console.error('Migration failed', error);
    process.exit(1);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
