import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260328201249 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "quote" add column if not exists "custom_details" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "quote" drop column if exists "custom_details";`);
  }

}
