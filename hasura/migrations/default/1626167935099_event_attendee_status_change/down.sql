-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- ALTER TABLE event_attendees
    DROP COLUMN status;
    
DROP TABLE event_attendee_status;

CREATE TABLE event_attendee_status (
    value TEXT NOT NULL PRIMARY KEY,
    description TEXT DEFAULT NULL
);

ALTER TABLE event_attendees
    ADD COLUMN status TEXT REFERENCES event_attendee_status;
    
INSERT INTO event_attendee_status (value, description) VALUES ('owner', 'owner of event'), ('invited', 'user invited to event'),
('ok', 'user has joined event'), ('conflict', 'user has conflicting events');
