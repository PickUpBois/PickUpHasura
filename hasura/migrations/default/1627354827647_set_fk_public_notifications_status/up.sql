alter table "public"."notifications"
  add constraint "notifications_status_fkey"
  foreign key ("status")
  references "public"."notification_status"
  ("value") on update restrict on delete restrict;
