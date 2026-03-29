import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260329131842 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "company_address" alter column "first_name" type text using ("first_name"::text);`);
    this.addSql(`alter table if exists "company_address" alter column "first_name" drop not null;`);
    this.addSql(`alter table if exists "company_address" alter column "last_name" type text using ("last_name"::text);`);
    this.addSql(`alter table if exists "company_address" alter column "last_name" drop not null;`);
    this.addSql(`alter table if exists "company_address" alter column "province" type text using ("province"::text);`);
    this.addSql(`alter table if exists "company_address" alter column "province" set not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "company_address" alter column "first_name" type text using ("first_name"::text);`);
    this.addSql(`alter table if exists "company_address" alter column "first_name" set not null;`);
    this.addSql(`alter table if exists "company_address" alter column "last_name" type text using ("last_name"::text);`);
    this.addSql(`alter table if exists "company_address" alter column "last_name" set not null;`);
    this.addSql(`alter table if exists "company_address" alter column "province" type text using ("province"::text);`);
    this.addSql(`alter table if exists "company_address" alter column "province" drop not null;`);
  }

}
