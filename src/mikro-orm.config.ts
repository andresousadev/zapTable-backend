import { PostgreSqlDriver } from '@mikro-orm/postgresql';

export const config = {
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  dbName: 'zapTable',
  driver: PostgreSqlDriver,
};
