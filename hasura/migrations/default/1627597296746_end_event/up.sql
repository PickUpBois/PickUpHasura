CREATE OR REPLACE FUNCTION public.end_event(event_id integer, team1_members text[], team2_members text[], team1_win boolean, team1_scores integer[], team2_scores integer[])
 RETURNS SETOF events
 LANGUAGE plpgsql
AS $function$
DECLARE 
    p_event_id alias for $1;
    team1_id INT;
    team2_id INT;
BEGIN
    team1_scores = json_build_object('scores', team1_scores::int[]);
    team2_scores = json_build_object('scores', team2_scores::int[]);
    INSERT INTO event_teams (event_id, set_scores) VALUES (p_event_id, team1_scores) RETURNING team_id INTO team1_id;
    INSERT INTO event_teams (event_id, set_scores) VALUES (event_id, team2_scores) RETURNING team_id INTO team2_id;
    IF team1_win = TRUE THEN
        UPDATE events SET status = 'closed', winner_id = team1_id, end_date = now() WHERE events.event_id = p_event_id;
    ELSE
        UPDATE events SET status = 'closed', winner_id = team2_id, end_date = now() WHERE events.event_id = p_event_id;
    END IF;
    DELETE FROM event_attendees AS a WHERE a.event_id = p_event_id AND a.status = 'invited';
END;
$function$;
