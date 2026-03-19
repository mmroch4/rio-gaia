import { Migration } from '@mikro-orm/migrations';

export class Migration20260203012212 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "company" add column if not exists "vat" text ;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "company" drop column if exists "vat";`);
  }

}
