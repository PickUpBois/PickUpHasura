SET check_function_bodies = false;
CREATE TABLE public.events (
    event_id integer NOT NULL,
    name text NOT NULL,
    info text NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone,
    deleted boolean DEFAULT false NOT NULL,
    capacity integer NOT NULL,
    result_info text,
    winner_id integer,
    mvp_id text,
    location_id integer,
    status text DEFAULT 'open'::text NOT NULL,
    type text NOT NULL
);
CREATE FUNCTION public.end_event(event_id integer, team1_members text[], team2_members text[], team1_win boolean, team1_scores integer[], team2_scores integer[]) RETURNS SETOF public.events
    LANGUAGE plpgsql
    AS $$
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
$$;
CREATE TABLE public.users (
    user_id text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    username text NOT NULL,
    college text,
    photourl text,
    tokens tsvector,
    goat_score integer DEFAULT 0 NOT NULL
);
CREATE FUNCTION public.get_friends(user_row public.users) RETURNS SETOF public.users
    LANGUAGE sql STABLE
    AS $$
    SELECT u.user_id, u.first_name, u.last_name, u.username, u.photourl, u.college, u.tokens, u.goat_score 
    FROM users as u
    LEFT JOIN relationships as r1
    ON u.user_id = r1.friend_id
    LEFT JOIN relationships as r2
    ON u.user_id = r2.user_id
        WHERE r1.user_id = user_row.user_id
        AND r1.status = 1
        AND r2.friend_id = user_row.user_id
        AND r2.status = 1
$$;
CREATE TABLE public.notifications (
    event_id integer,
    actor_id text,
    created_at timestamp with time zone NOT NULL,
    type text NOT NULL,
    id integer NOT NULL
);
CREATE FUNCTION public.get_notifications(user_row public.users) RETURNS SETOF public.notifications
    LANGUAGE sql STABLE
    AS $$
    /*Getting friend requests.*/
    (
    SELECT NULL as event_id, u.user_id as actor_id, r1.created_at as created_at, 'friendRequestSend' as type, 0 as id
    FROM users as u
    LEFT JOIN relationships AS r1 ON u.user_id = r1.user_id
    WHERE r1.friend_id = user_row.user_id
    AND r1.status = 'friend' /*friend*/
    AND NOT EXISTS (SELECT * FROM relationships as r2 WHERE r2.user_id = r1.friend_id AND r2.friend_id = r1.user_id)
    )
    UNION ALL
    (
    /*Getting info notifications*/
    SELECT n.event_id, n.actor_id, n.created_at, n.type, n.notification_id as id
    FROM info_notifications as n
    WHERE n.user_id = user_row.user_id
    AND n.status = 'unread' /*unread*/
    )
    UNION ALL
    (
    /*Event invitations*/
    SELECT DISTINCT e.event_id, a.invited_by as actor_id, a.invited_at as created_at, 'eventInvitation' as type, 0 as id /*enum value is eventInvitation*/
    FROM events as e
    LEFT JOIN event_attendees as a ON e.event_id = a.event_id
    WHERE a.status = 'invited' /*invited*/
    AND a.attendee_id = user_row.user_id
    AND e.end_date IS NOT NULL
    AND e.deleted = FALSE
    )
    UNION ALL
    (
    /*Get finish event notifications*/
    SELECT DISTINCT e.event_id, NULL as actor_id, e.start_date as created_at, 'finishEvent' as type, 0 as id /*enum value is finishEvent*/
    FROM events as e
    LEFT JOIN event_attendees as a ON e.event_id = a.event_id
    WHERE a.status = 'owner' /*owner*/
    AND a.voted = FALSE
    AND a.attendee_id = user_row.user_id
    AND e.status = 'ip' /*ip*/
    AND e.deleted = FALSE
    )
    UNION ALL
    (
    /*Get vote for mvp notifications*/
    SELECT DISTINCT e.event_id as event_id, NULL as actor_id, a.invited_at as created_at, 'voteForMvp' as type, 0 as id
    FROM events as e
    LEFT JOIN event_attendees as a ON e.event_id = a.event_id
    WHERE e.status = 'closed' /*closed*/
    AND a.voted = FALSE
    AND a.attendee_id = user_row.user_id
    AND e.deleted = FALSE
    );
$$;
CREATE TABLE public.device_tokens (
    user_id text NOT NULL,
    token text NOT NULL
);
CREATE TABLE public.domain_event_type (
    value text NOT NULL,
    description text
);
CREATE TABLE public.domain_events (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    payload jsonb,
    type text NOT NULL,
    event_id integer,
    user_id text
);
COMMENT ON TABLE public.domain_events IS 'stores server side events';
CREATE SEQUENCE public.domain_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.domain_events_id_seq OWNED BY public.domain_events.id;
CREATE TABLE public.event_attendee_status (
    value text NOT NULL,
    description text
);
CREATE TABLE public.event_attendees (
    event_attendee_id integer NOT NULL,
    event_id integer NOT NULL,
    attendee_id text NOT NULL,
    joined_at timestamp with time zone,
    invited_at timestamp with time zone,
    invited_by text,
    vote_count integer DEFAULT 0 NOT NULL,
    voted boolean DEFAULT false NOT NULL,
    team_id integer,
    status text
);
CREATE SEQUENCE public.event_attendees_event_attendee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.event_attendees_event_attendee_id_seq OWNED BY public.event_attendees.event_attendee_id;
CREATE TABLE public.event_files (
    id integer NOT NULL,
    event_id integer NOT NULL,
    user_id text NOT NULL,
    extension text NOT NULL,
    file_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.event_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.event_files_id_seq OWNED BY public.event_files.id;
CREATE TABLE public.event_status (
    value text NOT NULL,
    description text DEFAULT 'null'::text
);
CREATE TABLE public.event_teams (
    team_id integer NOT NULL,
    event_id integer NOT NULL,
    set_scores integer[]
);
CREATE SEQUENCE public.event_teams_team_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.event_teams_team_id_seq OWNED BY public.event_teams.team_id;
CREATE TABLE public.event_type (
    value text NOT NULL,
    description text
);
CREATE SEQUENCE public.event_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.event_type_id_seq OWNED BY public.event_type.value;
CREATE SEQUENCE public.events_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.events_event_id_seq OWNED BY public.events.event_id;
CREATE TABLE public.friend_status (
    value text NOT NULL,
    description text
);
CREATE TABLE public.info_notifications (
    notification_id integer NOT NULL,
    user_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    actor_id text,
    event_id integer,
    type text,
    status text
);
CREATE SEQUENCE public.info_notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.info_notifications_notification_id_seq OWNED BY public.info_notifications.notification_id;
CREATE TABLE public.locations (
    location_id integer NOT NULL,
    name text NOT NULL,
    capacity integer,
    num_people integer DEFAULT 0 NOT NULL,
    coordinates public.geography(Point,4326) NOT NULL,
    street text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    postal_code text NOT NULL,
    country text NOT NULL,
    iso_country_code text NOT NULL,
    sub_locality text
);
CREATE SEQUENCE public.locations_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.locations_location_id_seq OWNED BY public.locations.location_id;
CREATE TABLE public.notification_status (
    value text NOT NULL,
    description text
);
CREATE TABLE public.notification_type (
    value text NOT NULL,
    description text
);
CREATE TABLE public.relationships (
    relationship_id integer NOT NULL,
    user_id text NOT NULL,
    friend_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    status text
);
CREATE SEQUENCE public.relationships_relationship_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.relationships_relationship_id_seq OWNED BY public.relationships.relationship_id;
ALTER TABLE ONLY public.domain_events ALTER COLUMN id SET DEFAULT nextval('public.domain_events_id_seq'::regclass);
ALTER TABLE ONLY public.event_attendees ALTER COLUMN event_attendee_id SET DEFAULT nextval('public.event_attendees_event_attendee_id_seq'::regclass);
ALTER TABLE ONLY public.event_files ALTER COLUMN id SET DEFAULT nextval('public.event_files_id_seq'::regclass);
ALTER TABLE ONLY public.event_teams ALTER COLUMN team_id SET DEFAULT nextval('public.event_teams_team_id_seq'::regclass);
ALTER TABLE ONLY public.event_type ALTER COLUMN value SET DEFAULT nextval('public.event_type_id_seq'::regclass);
ALTER TABLE ONLY public.events ALTER COLUMN event_id SET DEFAULT nextval('public.events_event_id_seq'::regclass);
ALTER TABLE ONLY public.info_notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.info_notifications_notification_id_seq'::regclass);
ALTER TABLE ONLY public.locations ALTER COLUMN location_id SET DEFAULT nextval('public.locations_location_id_seq'::regclass);
ALTER TABLE ONLY public.relationships ALTER COLUMN relationship_id SET DEFAULT nextval('public.relationships_relationship_id_seq'::regclass);
ALTER TABLE ONLY public.device_tokens
    ADD CONSTRAINT device_tokens_pkey PRIMARY KEY (user_id, token);
ALTER TABLE ONLY public.domain_event_type
    ADD CONSTRAINT domain_event_type_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.domain_events
    ADD CONSTRAINT domain_events_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.event_attendee_status
    ADD CONSTRAINT event_attendee_status_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.event_attendees
    ADD CONSTRAINT event_attendees_pkey PRIMARY KEY (event_id, attendee_id);
ALTER TABLE ONLY public.event_files
    ADD CONSTRAINT event_files_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.event_status
    ADD CONSTRAINT event_status_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.event_teams
    ADD CONSTRAINT event_teams_pkey PRIMARY KEY (team_id);
ALTER TABLE ONLY public.event_type
    ADD CONSTRAINT event_type_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (event_id);
ALTER TABLE ONLY public.friend_status
    ADD CONSTRAINT friend_status_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.info_notifications
    ADD CONSTRAINT info_notifications_pkey PRIMARY KEY (notification_id);
ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (location_id);
ALTER TABLE ONLY public.notification_status
    ADD CONSTRAINT notification_status_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.notification_type
    ADD CONSTRAINT notification_type_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_pkey PRIMARY KEY (user_id, friend_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
ALTER TABLE ONLY public.device_tokens
    ADD CONSTRAINT device_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.domain_events
    ADD CONSTRAINT domain_events_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.domain_events
    ADD CONSTRAINT domain_events_type_fkey FOREIGN KEY (type) REFERENCES public.domain_event_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.domain_events
    ADD CONSTRAINT domain_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.event_attendees
    ADD CONSTRAINT event_attendees_attendee_id_fkey FOREIGN KEY (attendee_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.event_attendees
    ADD CONSTRAINT event_attendees_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.event_attendees
    ADD CONSTRAINT event_attendees_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.event_attendees
    ADD CONSTRAINT event_attendees_status_fkey FOREIGN KEY (status) REFERENCES public.event_attendee_status(value);
ALTER TABLE ONLY public.event_attendees
    ADD CONSTRAINT event_attendees_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.event_teams(team_id);
ALTER TABLE ONLY public.event_files
    ADD CONSTRAINT event_files_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id);
ALTER TABLE ONLY public.event_files
    ADD CONSTRAINT event_files_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.event_teams
    ADD CONSTRAINT event_teams_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(location_id);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_mvp_id_fkey FOREIGN KEY (mvp_id) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_status_fkey FOREIGN KEY (status) REFERENCES public.event_status(value);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_type_fkey FOREIGN KEY (type) REFERENCES public.event_type(value);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES public.event_teams(team_id);
ALTER TABLE ONLY public.info_notifications
    ADD CONSTRAINT info_notifications_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.info_notifications
    ADD CONSTRAINT info_notifications_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id);
ALTER TABLE ONLY public.info_notifications
    ADD CONSTRAINT info_notifications_status_fkey FOREIGN KEY (status) REFERENCES public.notification_status(value);
ALTER TABLE ONLY public.info_notifications
    ADD CONSTRAINT info_notifications_type_fkey FOREIGN KEY (type) REFERENCES public.notification_type(value);
ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id);
ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_type_fkey FOREIGN KEY (type) REFERENCES public.notification_type(value) ON UPDATE CASCADE;
ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_status_fkey FOREIGN KEY (status) REFERENCES public.friend_status(value);
ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
