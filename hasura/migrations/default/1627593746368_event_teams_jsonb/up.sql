ALTER TABLE event_teams DROP COLUMN set_scores;
ALTER TABLE event_teams ADD COLUMN set_scores JSONB;
