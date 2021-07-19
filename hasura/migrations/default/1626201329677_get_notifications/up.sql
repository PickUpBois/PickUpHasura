CREATE OR REPLACE FUNCTION get_notifications(user_row users)
RETURNS SETOF notifications as $$
    /*Getting friend requests.*/
    (
    SELECT NULL as event_id, u.user_id as actor_id, r1.created_at as created_at, 'friendRequestSend' as type, 0 as id
    FROM users as u
    LEFT JOIN relationships AS r1 ON u.user_id = r1.user_id
    WHERE r1.friend_id = user_row.user_id
    AND r1.status = 'friend' /*friend*/
    AND NOT EXISTS (SELECT * FROM relationships as r2 WHERE r2.user_id = r1.friend_id AND r2.friend_id = r1.user_id)
    )
    UNION ALL
    (
    /*Getting info notifications*/
    SELECT n.event_id, n.actor_id, n.created_at, n.type, n.notification_id as id
    FROM info_notifications as n
    WHERE n.user_id = user_row.user_id
    AND n.status = 'unread' /*unread*/
    )
    UNION ALL
    (
    /*Event invitations*/
    SELECT DISTINCT e.event_id, a.invited_by as actor_id, a.invited_at as created_at, 'eventInvitation' as type, 0 as id /*enum value is eventInvitation*/
    FROM events as e
    LEFT JOIN event_attendees as a ON e.event_id = a.event_id
    WHERE a.status = 'invited' /*invited*/
    AND a.attendee_id = user_row.user_id
    AND e.end_date IS NOT NULL
    AND e.deleted = FALSE
    )
    UNION ALL
    (
    /*Get finish event notifications*/
    SELECT DISTINCT e.event_id, NULL as actor_id, e.start_date as created_at, 'finishEvent' as type, 0 as id /*enum value is finishEvent*/
    FROM events as e
    LEFT JOIN event_attendees as a ON e.event_id = a.event_id
    WHERE a.status = 'owner' /*owner*/
    AND a.voted = FALSE
    AND a.attendee_id = user_row.user_id
    AND e.status = 'ip' /*ip*/
    AND e.deleted = FALSE
    )
    UNION ALL
    (
    /*Get vote for mvp notifications*/
    SELECT DISTINCT e.event_id as event_id, NULL as actor_id, a.invited_at as created_at, 'voteForMvp' as type, 0 as id
    FROM events as e
    LEFT JOIN event_attendees as a ON e.event_id = a.event_id
    WHERE e.status = 'closed' /*closed*/
    AND a.voted = FALSE
    AND a.attendee_id = user_row.user_id
    AND e.deleted = FALSE
    );
$$ LANGUAGE sql STABLE;
