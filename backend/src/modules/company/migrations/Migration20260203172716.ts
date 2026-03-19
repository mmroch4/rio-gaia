import { Migration } from '@mikro-orm/migrations';

export class Migration20260203172716 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "company" add column if not exists "verified" boolean null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "company" drop column if exists "verified";`);
  }

}
