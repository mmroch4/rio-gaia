import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260329185533 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "quote" add column if not exists "custom_details" text null, add column if not exists "shipping_cost" integer null;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_quote_deleted_at" ON "quote" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_message_deleted_at" ON "message" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_quote_deleted_at";`);
    this.addSql(`alter table if exists "quote" drop column if exists "custom_details", drop column if exists "shipping_cost";`);

    this.addSql(`drop index if exists "IDX_message_deleted_at";`);
  }

}
