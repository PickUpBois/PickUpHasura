alter table "public"."events" drop constraint "events_winner_id_fkey",
  add constraint "events_winner_id_fkey"
  foreign key ("winner_id")
  references "public"."event_teams"
  ("team_id") on update cascade on delete cascade;
