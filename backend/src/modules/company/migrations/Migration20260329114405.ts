import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260329114405 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "company_address" ("id" text not null, "label" text not null, "first_name" text not null, "last_name" text not null, "company_name" text not null, "address_1" text not null, "address_2" text null, "postal_code" text not null, "city" text not null, "province" text null, "country_code" text not null, "phone" text null, "company_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "company_address_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_company_address_company_id" ON "company_address" ("company_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_company_address_deleted_at" ON "company_address" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "company_address" add constraint "company_address_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade;`);

    this.addSql(`alter table if exists "employee" alter column "raw_spending_limit" type jsonb using ("raw_spending_limit"::jsonb);`);
    this.addSql(`alter table if exists "employee" alter column "raw_spending_limit" set default '{"value":"0","precision":20}';`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "company_address" cascade;`);

    this.addSql(`alter table if exists "employee" alter column "raw_spending_limit" drop default;`);
    this.addSql(`alter table if exists "employee" alter column "raw_spending_limit" type jsonb using ("raw_spending_limit"::jsonb);`);
  }

}
