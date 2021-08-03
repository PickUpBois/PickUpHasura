
alter table "public"."notifications" drop constraint "notifications_userId_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notifications" add column "userId" text
--  not null;
