CREATE OR REPLACE FUNCTION end_event(
    event_id int, 
    team1_members text[], 
    team2_members text[], 
    team1_win boolean, 
    team1_scores int[], 
    team2_scores int[]
)
RETURNS SETOF events as $$
DECLARE 
    team1_id INT;
    team2_id INT;
BEGIN
    INSERT INTO event_teams (event_id, set_scores) VALUES (event_id, team1_scores) RETURNING team_id INTO team1_id;
    INSERT INTO event_teams (event_id, set_scores) VALUES (event_id, team2_scores) RETURNING team_id INTO team2_id;
    IF team1_win = TRUE THEN
        UPDATE events SET status = 'closed', winner_id = team1_id;
    ELSE
        UPDATE events SET status = 'closed', winner_id = team2_id, end_date = now();
    END IF;
    DELETE FROM event_attendees AS a WHERE a.event_id = event_id AND a.status = 'invited';
END;
$$ LANGUAGE plpgsql VOLATILE;
