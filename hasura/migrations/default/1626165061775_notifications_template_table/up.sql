CREATE TABLE notifications (
    event_id INT REFERENCES events,
    actor_id TEXT REFERENCES users,
    created_at TIMESTAMPTZ NOT NULL,
    type INT NOT NULL
);
