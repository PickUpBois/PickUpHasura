CREATE OR REPLACE FUNCTION public.search_users2(search text)
 RETURNS text
 LANGUAGE plpgsql
 STABLE
AS $function$
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
    result = FORMAT('SELECT * FROM users WHERE tokens @@ to_tsquery(''%s'')',
  result
);
    RETURN result;
END;
$function$;
