-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE FUNCTION add_tokens()
--   RETURNS trigger AS $BODY$
--   DECLARE temp text;
--   BEGIN
--         temp = '%s %s %s', lower(NEW.first_name), lower(NEW.last_name), lower(NEW.username);
--       NEW.tokens = to_tsvector(temp);
--       RETURN NEW;
--   END;
--   $BODY$ LANGUAGE plpgsql;
--
--   CREATE TRIGGER users_search_trigger BEFORE INSERT OR UPDATE ON users
--       FOR EACH ROW EXECUTE PROCEDURE add_tokens();
