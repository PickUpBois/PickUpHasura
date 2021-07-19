-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- ALTER TABLE events
    DROP COLUMN status;
    
DROP TABLE event_status;

CREATE TABLE event_status (
    value TEXT NOT NULL PRIMARY KEY,
    description TEXT
);

ALTER TABLE events
    ADD COLUMN status TEXT REFERENCES event_status;
