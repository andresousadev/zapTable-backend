import { Migrator } from '@mikro-orm/migrations';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';

export default defineConfig({
  // TODO: Introduce Zod to parse configs
  host: process.env.ZAP_TABLE_DB_HOST,
  port: Number(process.env.ZAP_TABLE_DB_PORT),
  user: process.env.ZAP_TABLE_DB_USER,
  password: process.env.ZAP_TABLE_DB_PASSWORD,
  dbName: process.env.ZAP_TABLE_DB_DBNAME,
  driver: PostgreSqlDriver,
  entities: ['./src/**/*.entity.ts'],
  extensions: [Migrator],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
});
