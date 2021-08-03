alter table "public"."notifications" add column "status" text
 not null default 'unread';
