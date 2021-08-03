INSERT INTO domain_event_type(value, description) VALUES
    ('USER_CREATED', 'user created'),
    ('USER_LEFT_EVENT', 'user has left an event'),
    ('USER_JOINED_EVENT', 'user has joined an event'),
    ('USER_INVITED_TO_EVENT', 'user invited to event'),
    ('USER_ACCEPT_FRIEND_REQUEST', 'user has accepted a friend request'),
    ('USER_REJECTED_FRIEND_REQUEST', 'user has rejected a friend request'),
    ('USER_SELECTED_MVP', 'user was selected mvp of an event'),
    ('USER_SENT_FRIEND_REQUEST', 'user was sent a friend request'),
    ('EVENT_STARTED', 'event has started'),
    ('EVENT_DELETED', 'event was deleted'),
    ('EVENT_FINISHED', 'event was finished'),
    ('EVENT_CREATED', 'event was created'),
    ('USER_VOTED_FOR_MVP', 'user has voted for an mvp');

INSERT INTO notification_status(value, description) VALUES
    ('read', 'notification was read'),
    ('unread', 'notification was unread');

INSERT INTO event_status(value, description) VALUES
    ('open', 'event is open'),
    ('closed', 'event is closed'),
    ('ip', 'event is in progress');

INSERT INTO event_attendee_status(value, description) VALUES
    ('owner', 'owner of event'),
    ('invited', 'invited to event'),
    ('ok', 'user is in event'),
    ('conflict', 'user has conflict with event');

INSERT INTO event_type(value, description) VALUES
    ('tennis', 'tennis'),
    ('basketball', 'basketball event');

INSERT INTO notification_type(value, description) VALUES
    ('friendRequestSend', 'you have received a friend request'),
    ('friendRequestAccept', 'somebody accepted your friend request'),
    ('friendRequestReject', 'somebody rejected your friend request'),
    ('eventInvitation', 'you have been invited to an event'),
    ('finishEvent', 'your event has finished'),
    ('voteForMvp', 'you must vote for mvp'),
    ('selectedMvp', 'you have been selected mvp'),
    ('leftEvent', 'user has left your event'),
    ('joinedEvent', 'user has joined your event'),
    ('deletedEvent', 'owner has deleted the event');

INSERT INTO friend_status(value, description) VALUES
    ('friend', 'user is a friend');

