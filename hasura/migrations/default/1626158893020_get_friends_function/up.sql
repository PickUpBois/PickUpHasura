CREATE FUNCTION get_friends(user_row users)
RETURNS SETOF users as $$
    SELECT u.user_id, u.first_name, u.last_name, u.username, u.photourl, u.college, u.tokens, u.goat_score 
    FROM users as u
    LEFT JOIN relationships as r1
    ON u.user_id = r1.friend_id
    LEFT JOIN relationships as r2
    ON u.user_id = r2.user_id
        WHERE r1.user_id = user_row.user_id
        AND r1.status = 1
        AND r2.friend_id = user_row.user_id
        AND r2.status = 1
$$ LANGUAGE sql STABLE;
