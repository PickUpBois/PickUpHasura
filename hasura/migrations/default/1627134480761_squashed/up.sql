
alter table "public"."notifications" add column "userId" text
 not null;

alter table "public"."notifications"
  add constraint "notifications_userId_fkey"
  foreign key ("userId")
  references "public"."users"
  ("user_id") on update restrict on delete cascade;
