alter table "public"."event_teams" alter column "set_scores" drop not null;
alter table "public"."event_teams" add column "set_scores" _int4;
