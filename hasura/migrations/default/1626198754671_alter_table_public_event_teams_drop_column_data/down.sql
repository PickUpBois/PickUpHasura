alter table "public"."event_teams" alter column "data" drop not null;
alter table "public"."event_teams" add column "data" jsonb;
