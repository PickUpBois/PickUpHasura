from datetime import datetime

def test_accept_event_invitation(create_user, create_event, invite_user_to_event, accept_event_invitation):
    ownerId = create_user('test1', 'test1', 'test1', 'test1', 'college')
    userId = create_user('test2', 'test2', 'test2', 'test2', 'college')
    eventId = create_event(ownerId, 'event', 'event', 4, datetime.now().isoformat(), 'tennis', 'open')
    invite_user_to_event(ownerId, eventId, userId)
    accept_event_invitation(userId, eventId)

def test_decline_event_invitation(create_user, create_event, invite_user_to_event, decline_event_invitation):
    ownerId = create_user('test1', 'test1', 'test1', 'test1', 'college')
    userId = create_user('test2', 'test2', 'test2', 'test2', 'college')
    eventId = create_event(ownerId, 'event', 'event', 4, datetime.now().isoformat(), 'tennis', 'open')
    invite_user_to_event(ownerId, eventId, userId)
    decline_event_invitation(userId, eventId)

def test_leave_event(create_user, create_event, join_event, leave_event):
    ownerId = create_user('test1', 'test1', 'test1', 'test1', 'college')
    userId = create_user('test2', 'test2', 'test2', 'test2', 'college')
    eventId = create_event(ownerId, 'event', 'event', 4, datetime.now().isoformat(), 'tennis', 'open')
    join_event(eventId, userId)
    leave_event(eventId, userId)

def test_delete_event(create_user, create_event, delete_event):
    ownerId = create_user('test1', 'test1', 'test1', 'test1', 'college')
    eventId = create_event(ownerId, 'event', 'event', 4, datetime.now().isoformat(), 'tennis', 'open')
    delete_event(eventId, ownerId)

def test_accept_friend_request(create_user, send_friend_request, accept_friend_request):
    userId1 = create_user('test1', 'test1', 'test1', 'test1', 'college')
    userId2 = create_user('test2', 'test2', 'test2', 'test2', 'college')
    send_friend_request(userId1, userId2)
    accept_friend_request(userId2, userId1)

def test_reject_friend_request(create_user, send_friend_request, reject_friend_request):
    userId1 = create_user('test1', 'test1', 'test1', 'test1', 'college')
    userId2 = create_user('test2', 'test2', 'test2', 'test2', 'college')
    send_friend_request(userId1, userId2)
    reject_friend_request(userId2, userId1)

def test_remove_friend(create_user, send_friend_request, accept_friend_request, remove_friend):
    userId1 = create_user('test1', 'test1', 'test1', 'test1', 'college')
    userId2 = create_user('test2', 'test2', 'test2', 'test2', 'college')
    send_friend_request(userId1, userId2)
    accept_friend_request(userId2, userId1)
    remove_friend(userId1, userId2)

def test_cancel_event_invitation(create_user, create_event, invite_user_to_event, cancel_event_invitation):
    ownerId = create_user('test1', 'test1', 'test1', 'test1', 'college')
    userId = create_user('test2', 'test2', 'test2', 'test2', 'college')
    eventId = create_event(ownerId, 'event', 'event', 4, datetime.now().isoformat(), 'tennis', 'open')
    invite_user_to_event(ownerId, eventId, userId)
    cancel_event_invitation(ownerId, userId, eventId)

def test_update_user(create_user, update_user):
    userId = create_user('test1', 'test1', 'test1', 'test1', 'college')
    update_user(userId, {
        'firstName': None,
        'lastName': None,
        'username': 'jolly',
        'college': None,
        'photoUrl': None
    })

def test_start_event(create_user, create_event, start_event):
    ownerId = create_user('test1', 'test1', 'test1', 'test1', 'college')
    eventId = create_event(ownerId, 'event', 'event', 4, datetime.now().isoformat(), 'tennis', 'open')
    start_event(eventId)

def test_end_event(create_user, create_event, start_event, end_event):
    ownerId = create_user('test1', 'test1', 'test1', 'test1', 'college')
    eventId = create_event(ownerId, 'event', 'event', 4, datetime.now().isoformat(), 'tennis', 'open')
    start_event(eventId)
    end_event('test1', eventId, ['test1'], [], [6, 6], [0, 0], True)



