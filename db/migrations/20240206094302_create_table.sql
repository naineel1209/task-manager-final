-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE roles AS ENUM ('ADMIN', 'TL', 'DEV');

CREATE TYPE task_categories AS ENUM (
    'TaskCreationEditing',
    'ProjectManagement',
    'UserAccountsPermissions',
    'Integration',
    'Notifications',
    'SearchFilters',
    'Performance',
    'MobileResponsiveness',
    'ReportingAnalytics',
    'UI_',
    'UX',
    'Security',
    'GeneralBugs'
);

CREATE TYPE task_status AS ENUM (
    'TODO',
    'INPROGRESS',
    'DONE',
    'TESTING',
    'REOPEN'
);

CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    first_name VARCHAR(500) NOT NULL,
    last_name varchar(50) NOT NULL,
    username varchar(50) NOT NULL UNIQUE,
    password varchar NOT NULL,
    email varchar(100) NOT NULL,
    roles roles NOT NULL,
    refresh_token varchar,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title varchar(200),
    description text,
    team_id uuid,
    admin_id uuid,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teams (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(100) NOT NULL,
    tl_id uuid,
    admin_id uuid
);

CREATE TABLE teamsUsersMapping (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid,
    team_id uuid
);

CREATE TABLE tasks (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    title varchar(200) NOT NULL,
    description text NOT NULL,
    categories json NOT NULL,
    status task_status NOT NULL,
    tl_id uuid NOT NULL,
    project_id uuid NOT NULL,
    due_date timestamp NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasksUsersMapping (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    task_id uuid NOT NULL
);

CREATE TABLE comments (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    title varchar(100) NOT NULL,
    description text NOT NULL,
    user_id uuid NOT NULL,
    task_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activityLogs (
    id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4 (),
    task_id uuid NOT NULL,
    user_id uuid NOT NULL,
    log_date timestamp NOT NULL,
    status task_status NOT NULL
);

ALTER TABLE
    projects
ADD
    FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE;

ALTER TABLE
    projects
ADD
    FOREIGN KEY (admin_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE
    teams
ADD
    FOREIGN KEY (tl_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE
    teams
ADD
    FOREIGN KEY (admin_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE
    teamsUsersMapping
ADD
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE
    teamsUsersMapping
ADD
    FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE;

ALTER TABLE
    tasks
ADD
    FOREIGN KEY (tl_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE
    tasks
ADD
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE;

ALTER TABLE
    tasksUsersMapping
ADD
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE
    tasksUsersMapping
ADD
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE;

ALTER TABLE
    comments
ADD
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE
    comments
ADD
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE;

ALTER TABLE
    activityLogs
ADD
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE;

ALTER TABLE
    activityLogs
ADD
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- migrate:down
DROP TABLE IF EXISTS activityLogs;

DROP TABLE IF EXISTS comments;

DROP TABLE IF EXISTS tasksUsersMapping;

DROP TABLE IF EXISTS teamsUsersMapping;

DROP TABLE IF EXISTS tasks;

DROP TABLE IF EXISTS projects;

DROP TABLE IF EXISTS teams;

DROP TABLE IF EXISTS users;

DROP TYPE IF EXISTS task_status;

DROP TYPE IF EXISTS task_categories;

DROP TYPE IF EXISTS roles;