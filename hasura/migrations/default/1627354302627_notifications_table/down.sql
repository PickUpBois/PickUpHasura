-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- DROP FUNCTION get_notifications CASCADE;
-- DROP TABLE notifications;
-- CREATE TABLE notifications (
--     id SERIAL NOT NULL PRIMARY KEY,
--     user_id TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
--     actor_id TEXT REFERENCES users ON DELETE CASCADE,
--     event_id INT REFERENCES events ON DELETE CASCADE,
--     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--     type TEXT NOT NULL REFERENCES notification_type
-- );
