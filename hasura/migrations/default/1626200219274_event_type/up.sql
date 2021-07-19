ALTER TABLE events
    DROP COLUMN type;
    
ALTER TABLE event_type
    ALTER COLUMN value TYPE TEXT;
    
ALTER TABLE events ADD COLUMN type TEXT REFERENCES event_type;

INSERT INTO event_type (value, description) VALUES ('tennis', 'tennis type'), ('basketball', 'basketball type');
