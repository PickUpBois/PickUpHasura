alter table "public"."event_teams" drop constraint "event_teams_event_id_fkey",
  add constraint "event_teams_event_id_fkey"
  foreign key ("event_id")
  references "public"."events"
  ("event_id") on update cascade on delete cascade;
