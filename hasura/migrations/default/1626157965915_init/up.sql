SET check_function_bodies = false;
CREATE TABLE public.device_tokens (
    user_id text NOT NULL,
    token text NOT NULL
);
CREATE TABLE public.event_attendee_status (
    id integer NOT NULL,
    value text NOT NULL
);
CREATE SEQUENCE public.event_attendee_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.event_attendee_status_id_seq OWNED BY public.event_attendee_status.id;
CREATE TABLE public.event_attendees (
    event_attendee_id integer NOT NULL,
    event_id integer NOT NULL,
    attendee_id text NOT NULL,
    status integer NOT NULL,
    joined_at timestamp with time zone,
    invited_at timestamp with time zone,
    invited_by text,
    vote_count integer DEFAULT 0 NOT NULL,
    voted boolean DEFAULT false NOT NULL,
    team_id integer
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
    id integer NOT NULL,
    value text
);
CREATE SEQUENCE public.event_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.event_status_id_seq OWNED BY public.event_status.id;
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
    id integer NOT NULL,
    value text
);
CREATE SEQUENCE public.event_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.event_type_id_seq OWNED BY public.event_type.id;
CREATE TABLE public.events (
    event_id integer NOT NULL,
    name text NOT NULL,
    info text NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone,
    type integer NOT NULL,
    status integer NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    capacity integer NOT NULL,
    result_info text,
    winner_id integer,
    mvp_id text,
    location_id integer
);
CREATE SEQUENCE public.events_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.events_event_id_seq OWNED BY public.events.event_id;
CREATE TABLE public.friend_status (
    id integer NOT NULL,
    value text NOT NULL
);
CREATE SEQUENCE public.friend_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.friend_status_id_seq OWNED BY public.friend_status.id;
CREATE TABLE public.info_notifications (
    notification_id integer NOT NULL,
    user_id text NOT NULL,
    type integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    actor_id text,
    event_id integer,
    status integer NOT NULL
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
    id integer NOT NULL,
    status text NOT NULL
);
CREATE SEQUENCE public.notification_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.notification_status_id_seq OWNED BY public.notification_status.id;
CREATE TABLE public.notification_type (
    id integer NOT NULL,
    type text NOT NULL
);
CREATE SEQUENCE public.notification_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.notification_type_id_seq OWNED BY public.notification_type.id;
CREATE TABLE public.relationships (
    relationship_id integer NOT NULL,
    user_id text NOT NULL,
    friend_id text NOT NULL,
    status integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.relationships_relationship_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.relationships_relationship_id_seq OWNED BY public.relationships.relationship_id;
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
ALTER TABLE ONLY public.event_attendee_status ALTER COLUMN id SET DEFAULT nextval('public.event_attendee_status_id_seq'::regclass);
ALTER TABLE ONLY public.event_attendees ALTER COLUMN event_attendee_id SET DEFAULT nextval('public.event_attendees_event_attendee_id_seq'::regclass);
ALTER TABLE ONLY public.event_files ALTER COLUMN id SET DEFAULT nextval('public.event_files_id_seq'::regclass);
ALTER TABLE ONLY public.event_status ALTER COLUMN id SET DEFAULT nextval('public.event_status_id_seq'::regclass);
ALTER TABLE ONLY public.event_teams ALTER COLUMN team_id SET DEFAULT nextval('public.event_teams_team_id_seq'::regclass);
ALTER TABLE ONLY public.event_type ALTER COLUMN id SET DEFAULT nextval('public.event_type_id_seq'::regclass);
ALTER TABLE ONLY public.events ALTER COLUMN event_id SET DEFAULT nextval('public.events_event_id_seq'::regclass);
ALTER TABLE ONLY public.friend_status ALTER COLUMN id SET DEFAULT nextval('public.friend_status_id_seq'::regclass);
ALTER TABLE ONLY public.info_notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.info_notifications_notification_id_seq'::regclass);
ALTER TABLE ONLY public.locations ALTER COLUMN location_id SET DEFAULT nextval('public.locations_location_id_seq'::regclass);
ALTER TABLE ONLY public.notification_status ALTER COLUMN id SET DEFAULT nextval('public.notification_status_id_seq'::regclass);
ALTER TABLE ONLY public.notification_type ALTER COLUMN id SET DEFAULT nextval('public.notification_type_id_seq'::regclass);
ALTER TABLE ONLY public.relationships ALTER COLUMN relationship_id SET DEFAULT nextval('public.relationships_relationship_id_seq'::regclass);
ALTER TABLE ONLY public.device_tokens
    ADD CONSTRAINT device_tokens_pkey PRIMARY KEY (user_id, token);
ALTER TABLE ONLY public.event_attendee_status
    ADD CONSTRAINT event_attendee_status_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.event_attendees
    ADD CONSTRAINT event_attendees_pkey PRIMARY KEY (event_id, attendee_id);
ALTER TABLE ONLY public.event_files
    ADD CONSTRAINT event_files_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.event_status
    ADD CONSTRAINT event_status_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.event_teams
    ADD CONSTRAINT event_teams_pkey PRIMARY KEY (team_id);
ALTER TABLE ONLY public.event_type
    ADD CONSTRAINT event_type_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (event_id);
ALTER TABLE ONLY public.friend_status
    ADD CONSTRAINT friend_status_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.info_notifications
    ADD CONSTRAINT info_notifications_pkey PRIMARY KEY (notification_id);
ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (location_id);
ALTER TABLE ONLY public.notification_status
    ADD CONSTRAINT notification_status_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notification_type
    ADD CONSTRAINT notification_type_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_pkey PRIMARY KEY (user_id, friend_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
ALTER TABLE ONLY public.device_tokens
    ADD CONSTRAINT device_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.event_attendees
    ADD CONSTRAINT event_attendees_attendee_id_fkey FOREIGN KEY (attendee_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.event_attendees
    ADD CONSTRAINT event_attendees_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.event_attendees
    ADD CONSTRAINT event_attendees_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.event_attendees
    ADD CONSTRAINT event_attendees_status_fkey FOREIGN KEY (status) REFERENCES public.event_attendee_status(id);
ALTER TABLE ONLY public.event_attendees
    ADD CONSTRAINT event_attendees_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.event_teams(team_id);
ALTER TABLE ONLY public.event_files
    ADD CONSTRAINT event_files_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id);
ALTER TABLE ONLY public.event_files
    ADD CONSTRAINT event_files_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(location_id);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_mvp_id_fkey FOREIGN KEY (mvp_id) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_status_fkey FOREIGN KEY (status) REFERENCES public.event_status(id);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_type_fkey FOREIGN KEY (type) REFERENCES public.event_type(id);
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES public.event_teams(team_id);
ALTER TABLE ONLY public.info_notifications
    ADD CONSTRAINT info_notifications_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.users(user_id);
ALTER TABLE ONLY public.info_notifications
    ADD CONSTRAINT info_notifications_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id);
ALTER TABLE ONLY public.info_notifications
    ADD CONSTRAINT info_notifications_status_fkey FOREIGN KEY (status) REFERENCES public.notification_status(id);
ALTER TABLE ONLY public.info_notifications
    ADD CONSTRAINT info_notifications_type_fkey FOREIGN KEY (type) REFERENCES public.notification_type(id);
ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_status_fkey FOREIGN KEY (status) REFERENCES public.friend_status(id);
ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
