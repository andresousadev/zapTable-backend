import { Migration } from '@mikro-orm/migrations';

export class Migration20250419150155 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "category" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`create table "user" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "role" text check ("role" in ('owner', 'admin', 'staff')) not null, "business_id" int null);`);
    this.addSql(`create index "user_role_index" on "user" ("role");`);

    this.addSql(`create table "business" ("id" serial primary key, "name" varchar(255) not null, "description" varchar(255) not null, "photo_src" varchar(255) not null, "owner_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "restaurant" ("id" serial primary key, "name" varchar(255) not null, "address" varchar(255) not null, "phone_number" varchar(255) not null, "photo_src" varchar(255) not null, "business_id" int not null);`);

    this.addSql(`create table "table" ("id" serial primary key, "table_number" int not null, "qr_code" varchar(255) not null, "active" boolean not null, "status" text check ("status" in ('open', 'closed')) not null, "restaurant_id" int not null);`);

    this.addSql(`create table "restaurant_staff" ("restaurant_id" int not null, "staff_id" int not null, constraint "restaurant_staff_pkey" primary key ("restaurant_id", "staff_id"));`);

    this.addSql(`create table "product" ("id" serial primary key, "name" varchar(255) not null, "description" varchar(255) not null, "photo_src" varchar(255) not null, "default_price" int not null, "business_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "product_availability" ("restaurant_id" int not null, "product_id" int not null, "active" boolean not null default true, constraint "product_availability_pkey" primary key ("restaurant_id", "product_id"));`);

    this.addSql(`create table "category_products" ("category_id" int not null, "product_id" int not null, constraint "category_products_pkey" primary key ("category_id", "product_id"));`);

    this.addSql(`create table "menu" ("id" serial primary key, "name" varchar(255) not null, "description" varchar(255) not null, "photo_src" varchar(255) not null, "active" boolean not null, "business_id" int not null);`);

    this.addSql(`create table "product_price" ("product_id" int not null, "menu_id" int not null, "price" int not null, constraint "product_price_pkey" primary key ("product_id", "menu_id"));`);

    this.addSql(`create table "menu_categories" ("menu_id" int not null, "category_id" int not null, constraint "menu_categories_pkey" primary key ("menu_id", "category_id"));`);

    this.addSql(`create table "ingredient" ("id" serial primary key, "name" varchar(255) not null, "description" varchar(255) not null, "photo_src" varchar(255) not null, "business_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "product_customization" ("product_id" int not null, "ingredient_id" int not null, "price" int not null, constraint "product_customization_pkey" primary key ("product_id", "ingredient_id"));`);

    this.addSql(`create table "product_ingredients" ("product_id" int not null, "ingredient_id" int not null, constraint "product_ingredients_pkey" primary key ("product_id", "ingredient_id"));`);

    this.addSql(`alter table "user" add constraint "user_business_id_foreign" foreign key ("business_id") references "business" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "business" add constraint "business_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "restaurant" add constraint "restaurant_business_id_foreign" foreign key ("business_id") references "business" ("id") on update cascade;`);

    this.addSql(`alter table "table" add constraint "table_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade;`);

    this.addSql(`alter table "restaurant_staff" add constraint "restaurant_staff_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "restaurant_staff" add constraint "restaurant_staff_staff_id_foreign" foreign key ("staff_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "product" add constraint "product_business_id_foreign" foreign key ("business_id") references "business" ("id") on update cascade;`);

    this.addSql(`alter table "product_availability" add constraint "product_availability_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade;`);
    this.addSql(`alter table "product_availability" add constraint "product_availability_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);

    this.addSql(`alter table "category_products" add constraint "category_products_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "category_products" add constraint "category_products_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "menu" add constraint "menu_business_id_foreign" foreign key ("business_id") references "business" ("id") on update cascade;`);

    this.addSql(`alter table "product_price" add constraint "product_price_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);
    this.addSql(`alter table "product_price" add constraint "product_price_menu_id_foreign" foreign key ("menu_id") references "menu" ("id") on update cascade;`);

    this.addSql(`alter table "menu_categories" add constraint "menu_categories_menu_id_foreign" foreign key ("menu_id") references "menu" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "menu_categories" add constraint "menu_categories_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "ingredient" add constraint "ingredient_business_id_foreign" foreign key ("business_id") references "business" ("id") on update cascade;`);

    this.addSql(`alter table "product_customization" add constraint "product_customization_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);
    this.addSql(`alter table "product_customization" add constraint "product_customization_ingredient_id_foreign" foreign key ("ingredient_id") references "ingredient" ("id") on update cascade;`);

    this.addSql(`alter table "product_ingredients" add constraint "product_ingredients_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "product_ingredients" add constraint "product_ingredients_ingredient_id_foreign" foreign key ("ingredient_id") references "ingredient" ("id") on update cascade on delete cascade;`);
  }

}
