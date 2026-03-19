import { Migration } from '@mikro-orm/migrations';

export class Migration20260203012839 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "company" alter column "vat" type text using ("vat"::text);`);
    this.addSql(`alter table if exists "company" alter column "vat" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "company" alter column "vat" type text using ("vat"::text);`);
    this.addSql(`alter table if exists "company" alter column "vat" set not null;`);
  }

}
