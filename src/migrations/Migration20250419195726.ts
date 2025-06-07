import { Migration } from '@mikro-orm/migrations';

export class Migration20250419195726 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "category" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;`,
    );

    this.addSql(
      `alter table "user" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;`,
    );

    this.addSql(
      `alter table "restaurant" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;`,
    );

    this.addSql(
      `alter table "table" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;`,
    );

    this.addSql(
      `alter table "product_availability" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;`,
    );

    this.addSql(
      `alter table "menu" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;`,
    );

    this.addSql(
      `alter table "product_price" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;`,
    );

    this.addSql(
      `alter table "product_customization" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "category" drop column "created_at", drop column "updated_at";`,
    );

    this.addSql(
      `alter table "user" drop column "created_at", drop column "updated_at";`,
    );

    this.addSql(
      `alter table "restaurant" drop column "created_at", drop column "updated_at";`,
    );

    this.addSql(
      `alter table "table" drop column "created_at", drop column "updated_at";`,
    );

    this.addSql(
      `alter table "product_availability" drop column "created_at", drop column "updated_at";`,
    );

    this.addSql(
      `alter table "menu" drop column "created_at", drop column "updated_at";`,
    );

    this.addSql(
      `alter table "product_price" drop column "created_at", drop column "updated_at";`,
    );

    this.addSql(
      `alter table "product_customization" drop column "created_at", drop column "updated_at";`,
    );
  }
}
