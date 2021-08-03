
CREATE FUNCTION search_users(search text) RETURNS text AS $$
DECLARE
    result text;
    i integer := 0;
    c text;
    split text[];
BEGIN
    split = string_to_array($1, ' ');
    LOOP
        EXIT WHEN i >= array_length(split, 1);
        split[i] = split[i] || ':*';
        IF i < array_length(split, 1) - 1 THEN
            split[i] = split[i] || ' | ';
        END IF;
    END LOOP;
    result = array_to_string(split, '');
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION search_users(search text) RETURNS text AS $$
DECLARE
    result text;
    i integer := 0;
    c text;
    split text[];
BEGIN
    split = string_to_array($1, ' ');
    LOOP
        EXIT WHEN i >= array_length(split, 1);
        split[i] = split[i] || ':*';
        IF i < array_length(split, 1) - 1 THEN
            split[i] = split[i] || ' | ';
        END IF;
    END LOOP;
    result = array_to_string(split, '');
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION search_users(search text) RETURNS text AS $$
DECLARE
    result text;
    i integer := 0;
    c text;
    split text[];
BEGIN
    split = string_to_array($1, ' ');
    LOOP
        EXIT WHEN i >= array_length(split, 1);
        split[i] = split[i] || ':*';
        IF i < array_length(split, 1) - 1 THEN
            split[i] = split[i] || ' | ';
        END IF;
    END LOOP;
    result = array_to_string(split, '');
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION search_users(search text) RETURNS text AS $$
DECLARE
    result text;
    i integer := 0;
    c text;
    split text[];
BEGIN
    split = string_to_array($1, ' ');
    LOOP
        EXIT WHEN i >= array_length(split, 1);
        split[i] = split[i] || ':*';
        IF i < array_length(split, 1) - 1 THEN
            split[i] = split[i] || ' | ';
        END IF;
        i = i + 1;
    END LOOP;
    result = array_to_string(split, '');
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

DROP FUNCTION IF EXISTS search_users;
CREATE OR REPLACE FUNCTION search_users(search text) RETURNS SETOF users AS $$
DECLARE
    result text;
    i integer := 0;
    c text;
    split text[];
BEGIN
    split = string_to_array($1, ' ');
    LOOP
        EXIT WHEN i >= array_length(split, 1);
        split[i] = split[i] || ':*';
        IF i < array_length(split, 1) - 1 THEN
            split[i] = split[i] || ' | ';
        END IF;
        i = i + 1;
    END LOOP;
    result = array_to_string(split, '');
    SELECT * FROM users WHERE tokens @@ to_tsquery(result);
END;
$$ LANGUAGE plpgsql STABLE;

CREATE VIEW friends AS
    SELECT r1.* FROM relationships r1
    INNER JOIN relationships r2 ON
        r1.user_id = r2.friend_id
        AND
        r1.friend_id = r2.user_id;

CREATE OR REPLACE VIEW friends AS
    (
    SELECT r1.* FROM relationships r1
    INNER JOIN relationships r2 ON
        r1.user_id = r2.friend_id
        AND
        r1.friend_id = r2.user_id
    )
    UNION ALL
    (
    SELECT r2.* FROM relationships r1
    INNER JOIN relationships r2 ON
        r1.user_id = r2.friend_id
        AND
        r1.friend_id = r2.user_id
    );

CREATE OR REPLACE VIEW friends AS
    (
    SELECT r1.* FROM relationships r1
    INNER JOIN relationships r2 ON
        r1.user_id = r2.friend_id
        AND
        r1.friend_id = r2.user_id
    )
    UNION ALL
    (
    SELECT r2.* FROM relationships r1
    INNER JOIN relationships r2 ON
        r1.user_id = r2.friend_id
        AND
        r1.friend_id = r2.user_id
    );

DROP VIEW friends;


CREATE OR REPLACE FUNCTION friend_status(hasura_session json, user_row users)
RETURNS boolean AS $$
DECLARE
friendId text;
status boolean;
BEGIN
    friendId = hasura_session ->> 'x-hasura-user-id';
    status = EXISTS (SELECT r.user_id FROM relationships r WHERE r.user_id = user_row.user_id AND r.friend_id = friendId)
            AND EXISTS (SELECT r.user_id FROM relationships r WHERE r.user_id = friend_id AND r1.friend_id = user_row.user_id);
    RETURN status;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.friend_status(user_row users, hasura_session json)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
friendId text;
status boolean;
BEGIN
    friendId = hasura_session ->> 'x-hasura-user-id';
    status = EXISTS (SELECT r.user_id FROM relationships r WHERE r.user_id = user_row.user_id AND r.friend_id = friendId)
            AND EXISTS (SELECT r.user_id FROM relationships r WHERE r.user_id = friend_id AND r1.friend_id = user_row.user_id);
    RETURN status;
END;
$function$;

DROP FUNCTION friend_status(users, json);
DROP FUNCTION friend_status(json, users);

CREATE OR REPLACE FUNCTION public.friend_status(user_row users, hasura_session json)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
friendId text;
status boolean;
BEGIN
    friendId = hasura_session ->> 'x-hasura-user-id';
    status = EXISTS (SELECT r.user_id FROM relationships r WHERE r.user_id = user_row.user_id AND r.friend_id = friendId)
            AND EXISTS (SELECT r.user_id FROM relationships r WHERE r.user_id = friend_id AND r1.friend_id = user_row.user_id);
    RETURN status;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_friends(user_row users)
 RETURNS SETOF users
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    SELECT u.user_id, u.first_name, u.last_name, u.username, u.photourl, u.college, u.tokens, u.goat_score 
    FROM users as u
    LEFT JOIN relationships as r1
    ON u.user_id = r1.friend_id
    LEFT JOIN relationships as r2
    ON u.user_id = r2.user_id
        WHERE r1.user_id = user_row.user_id
        AND r1.status = 1
        AND r2.friend_id = user_row.user_id
        AND r2.status = 1;
END;
$function$;
