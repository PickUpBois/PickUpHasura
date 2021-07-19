alter table "public"."domain_events"
  add constraint "domain_events_event_id_fkey"
  foreign key ("event_id")
  references "public"."events"
  ("event_id") on update restrict on delete restrict;
