CREATE TABLE domain_event_type (
    value TEXT NOT NULL PRIMARY KEY,
    description TEXT DEFAULT NULL
);

INSERT INTO domain_event_type(value, description) VALUES 
('USER_JOINED_EVENT', 'User has joined an event. Payload: userId, eventId'),
('USER_LEFT_EVENT', 'User has left an event. Payload: userId, eventId'),
('USER_ACCEPTED_FRIEND_REQUEST', 'User has accepted another users friend request. Payload: senderId, sendeeId'),
('USER_CREATED_EVENT', 'User has created an event. Payload: userId, eventId'),
('USER_REJECTED_FRIEND_REQUEST', 'User has rejected another users friend request. Payload: senderId, sendeeId'),
('USER_SELECTED_MVP', 'User was selected mvp of an event. Payload: userId, eventId'),
('USER_SENT_FRIEND_REQUEST', 'User has sent a friend request. Payload: senderId, sendeeId'),
('USER_DELETED_EVENT', 'User deleted an event. Payload: userId, eventId'),
('EVENT_STARTED', 'An event has started. Payload: eventId'),
('USER_ENDED_EVENT', 'User has ended an event. Payload: userId, eventId');
