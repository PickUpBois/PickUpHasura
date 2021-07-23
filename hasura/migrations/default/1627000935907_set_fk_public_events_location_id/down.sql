alter table "public"."events" drop constraint "events_location_id_fkey",
  add constraint "events_location_id_fkey"
  foreign key ("location_id")
  references "public"."locations"
  ("location_id") on update no action on delete no action;
