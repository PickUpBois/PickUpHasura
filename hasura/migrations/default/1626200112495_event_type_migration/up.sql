ALTER TABLE events
    DROP COLUMN type;
    
ALTER TABLE event_type
    ALTER COLUMN value TYPE TEXT;
    
ALTER TABLE events ADD COLUMN type TEXT REFERENCES event_type;
