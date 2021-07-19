ALTER TABLE relationships
    DROP COLUMN status;
    
DROP TABLE friend_status;

CREATE TABLE friend_status (
    value TEXT NOT NULL PRIMARY KEY,
    description TEXT DEFAULT NULL
);

ALTER TABLE relationships
    ADD COLUMN status TEXT REFERENCES friend_status;
    
INSERT INTO notification_type (value, description) VALUES 
('friend', 'user is friend');
