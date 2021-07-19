ALTER TABLE info_notifications
    DROP COLUMN type;
    
DROP TABLE notification_type;

CREATE TABLE notification_type (
    value TEXT NOT NULL PRIMARY KEY,
    description TEXT DEFAULT NULL
);

ALTER TABLE info_notifications
    ADD COLUMN type TEXT REFERENCES notification_type;
    
INSERT INTO notification_type (value, description) VALUES 
('friendRequestSend', 'received friend requests'), 
('friendRequestAccept', 'user accepted your friend request'),
('friendRequestReject', 'user rejected your friend request'), 
('eventInvitation', 'invited to event'),
('finishEvent', 'owner needs to finish started event'),
('voteForMvp', 'vote for event mvp'),
('selectedMvp', 'you have been selected mvp in event'),
('leftEvent', 'user has left your event'),
('deletedEvent', 'owner has deleted this event'),
('joinedEvent', 'user has joined your event');
