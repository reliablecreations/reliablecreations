import { Migration } from '@mikro-orm/migrations';

export class Migration20250320103820 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "carousel" ("id" text not null, "url" text not null, "url2" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "carousel_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_carousel_deleted_at" ON "carousel" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "carousel" cascade;`);
  }

}
