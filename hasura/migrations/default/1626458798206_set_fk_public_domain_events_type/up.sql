alter table "public"."domain_events"
  add constraint "domain_events_type_fkey"
  foreign key ("type")
  references "public"."domain_event_type"
  ("value") on update restrict on delete restrict;
