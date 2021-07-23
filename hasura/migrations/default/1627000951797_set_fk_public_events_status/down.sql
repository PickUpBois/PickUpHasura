alter table "public"."events" drop constraint "events_status_fkey",
  add constraint "events_status_fkey"
  foreign key ("status")
  references "public"."event_status"
  ("value") on update no action on delete no action;
