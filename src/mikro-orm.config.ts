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
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  extensions: [Migrator],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    safe: process.env.NODE_ENV === 'production',
  },
  /*
  seeder: {
    path: './seeders', // Path to folder containing seeders
    defaultSeeder: 'DatabaseSeeder', // Default seeder class
    glob: '!(*.d).{js,ts}', // How to match seeder files
    emit: 'ts', // Generate seeders in TypeScript
    fileName: (className: string) => className, // Seeder file name convention
  },*/
  debug: true,
});
