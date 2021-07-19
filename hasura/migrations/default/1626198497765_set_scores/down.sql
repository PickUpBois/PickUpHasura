-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- ALTER TABLE event_teams
    DROP COLUMN set_scores;
    
ALTER TABLE event_teams
    ADD COLUMN set_scores INT[];
