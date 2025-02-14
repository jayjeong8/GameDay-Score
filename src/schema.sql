create table teams (
                       id bigint primary key,
                       team_name text not null,
                       total_score integer not null default 0,
                       rank integer not null,
                       rank_diff integer not null default 0,
                       created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table score_updates (
                               id bigint primary key generated always as identity,
                               team_id bigint references teams(id),
                               score_change integer not null,
                               game_type text not null,
                               created_at timestamp with time zone default timezone('utc'::text, now()) not null
);