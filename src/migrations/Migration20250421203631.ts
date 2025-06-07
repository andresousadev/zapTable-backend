import { Migration } from '@mikro-orm/migrations';

export class Migration20250421203631 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`drop table if exists "menu_categories" cascade;`);

    this.addSql(
      `alter table "user" add constraint "user_email_unique" unique ("email");`,
    );

    this.addSql(
      `alter table "business" add constraint "business_name_unique" unique ("name");`,
    );

    this.addSql(
      `alter table "restaurant" add constraint "restaurant_name_unique" unique ("name");`,
    );

    this.addSql(
      `alter table "table" add constraint "table_table_number_restaurant_id_unique" unique ("table_number", "restaurant_id");`,
    );

    this.addSql(
      `alter table "product" add constraint "product_name_unique" unique ("name");`,
    );

    this.addSql(
      `alter table "product_availability" add constraint "product_availability_restaurant_id_product_id_unique" unique ("restaurant_id", "product_id");`,
    );

    this.addSql(
      `alter table "menu" add constraint "menu_name_business_id_unique" unique ("name", "business_id");`,
    );

    this.addSql(
      `alter table "product_price" add constraint "product_price_product_id_menu_id_unique" unique ("product_id", "menu_id");`,
    );

    this.addSql(`alter table "category" add column "menu_id" int not null;`);
    this.addSql(
      `alter table "category" add constraint "category_menu_id_foreign" foreign key ("menu_id") references "menu" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "category" add constraint "category_name_menu_id_unique" unique ("name", "menu_id");`,
    );

    this.addSql(
      `alter table "ingredient" add constraint "ingredient_name_business_id_unique" unique ("name", "business_id");`,
    );

    this.addSql(
      `alter table "product_customization" add constraint "product_customization_product_id_ingredient_id_unique" unique ("product_id", "ingredient_id");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `create table "menu_categories" ("menu_id" int not null, "category_id" int not null, constraint "menu_categories_pkey" primary key ("menu_id", "category_id"));`,
    );

    this.addSql(
      `alter table "menu_categories" add constraint "menu_categories_menu_id_foreign" foreign key ("menu_id") references "menu" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "menu_categories" add constraint "menu_categories_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "category" drop constraint "category_menu_id_foreign";`,
    );

    this.addSql(
      `alter table "category" drop constraint "category_name_menu_id_unique";`,
    );
    this.addSql(`alter table "category" drop column "menu_id";`);

    this.addSql(`alter table "user" drop constraint "user_email_unique";`);

    this.addSql(
      `alter table "business" drop constraint "business_name_unique";`,
    );

    this.addSql(
      `alter table "restaurant" drop constraint "restaurant_name_unique";`,
    );

    this.addSql(
      `alter table "table" drop constraint "table_table_number_restaurant_id_unique";`,
    );

    this.addSql(`alter table "product" drop constraint "product_name_unique";`);

    this.addSql(
      `alter table "product_availability" drop constraint "product_availability_restaurant_id_product_id_unique";`,
    );

    this.addSql(
      `alter table "menu" drop constraint "menu_name_business_id_unique";`,
    );

    this.addSql(
      `alter table "product_price" drop constraint "product_price_product_id_menu_id_unique";`,
    );

    this.addSql(
      `alter table "ingredient" drop constraint "ingredient_name_business_id_unique";`,
    );

    this.addSql(
      `alter table "product_customization" drop constraint "product_customization_product_id_ingredient_id_unique";`,
    );
  }
}
