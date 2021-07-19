-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- ALTER TABLE events
    DROP COLUMN type;
    
ALTER TABLE event_type
    ALTER COLUMN value TYPE TEXT;
    
ALTER TABLE events ADD COLUMN type TEXT REFERENCES event_type;
