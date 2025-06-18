import { Migration } from '@mikro-orm/migrations';

export class Migration20250323073251 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "video" ("id" text not null, "url" text not null, "product_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "video_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_video_deleted_at" ON "video" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "video" cascade;`);
  }

}
