-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- ALTER TABLE event_teams
    ALTER COLUMN set_scores TYPE integer[] USING set_scores::integer[];
