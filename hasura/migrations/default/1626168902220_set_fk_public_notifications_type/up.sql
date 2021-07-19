alter table "public"."notifications"
  add constraint "notifications_type_fkey"
  foreign key ("type")
  references "public"."notification_type"
  ("value") on update cascade on delete no action;
