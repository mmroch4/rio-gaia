import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260203021017 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "company" alter column "vat" type text using ("vat"::text);`);
    this.addSql(`update "company" set "vat" = '' where "vat" is null;`);
    this.addSql(`alter table if exists "company" alter column "vat" set not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "company" alter column "vat" type text using ("vat"::text);`);
    this.addSql(`alter table if exists "company" alter column "vat" drop not null;`);
  }

}
