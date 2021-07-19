ALTER TABLE event_teams
    ALTER COLUMN set_scores TYPE integer[] USING set_scores::integer[];
