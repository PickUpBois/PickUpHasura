CREATE OR REPLACE FUNCTION add_tokens()
  RETURNS trigger AS $BODY$
  DECLARE temp text;
  BEGIN
        temp = lower(NEW.first_name) || ' ' ||  lower(NEW.last_name) || ' ' || lower(NEW.username);
      NEW.tokens = to_tsvector(temp);
      RETURN NEW;
  END;
  $BODY$ LANGUAGE plpgsql;
  
  DROP TRIGGER IF EXISTS users_search_trigger on users;
  CREATE TRIGGER users_search_trigger BEFORE INSERT OR UPDATE ON users
      FOR EACH ROW EXECUTE PROCEDURE add_tokens();
