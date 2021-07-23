alter table "public"."events" drop constraint "events_mvp_id_fkey",
  add constraint "events_mvp_id_fkey"
  foreign key ("mvp_id")
  references "public"."users"
  ("user_id") on update no action on delete no action;
