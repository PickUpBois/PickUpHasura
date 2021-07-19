alter table "public"."domain_events"
  add constraint "domain_events_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("user_id") on update restrict on delete restrict;
