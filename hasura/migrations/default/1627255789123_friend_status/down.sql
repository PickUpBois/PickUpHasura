-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE FUNCTION public.friend_status(user_row users, hasura_session json)
--  RETURNS boolean
--  LANGUAGE plpgsql
--  STABLE
-- AS $function$
-- DECLARE
-- friendId text;
-- status boolean;
-- BEGIN
--     friendId = hasura_session ->> 'x-hasura-user-id';
--     status = EXISTS (SELECT r1.user_id FROM relationships AS r1 WHERE r1.user_id = user_row.user_id AND r1.friend_id = friendId)
--             AND EXISTS (SELECT r2.user_id FROM relationships AS r2 WHERE r2.user_id = friend_id AND r2.friend_id = user_row.user_id);
--     RETURN status;
-- END;
-- $function$;
