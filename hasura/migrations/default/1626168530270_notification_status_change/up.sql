ALTER TABLE info_notifications
    DROP COLUMN status;
    
DROP TABLE notification_status;

CREATE TABLE notification_status (
    value TEXT NOT NULL PRIMARY KEY,
    description TEXT DEFAULT NULL
);

ALTER TABLE info_notifications
    ADD COLUMN status TEXT REFERENCES notification_status;
    
INSERT INTO notification_type (value, description) VALUES 
('unread', 'user has not read notification'), 
('read', 'user has read notification');
