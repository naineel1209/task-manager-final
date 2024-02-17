-- migrate:up
ALTER TABLE
    users
ADD
    COLUMN is_deleted boolean;

ALTER TABLE
    teamsusersmapping
ADD
    COLUMN is_deleted boolean;

ALTER TABLE
    projects
ADD
    COLUMN is_deleted boolean;

ALTER TABLE
    tasks
ADD
    COLUMN is_deleted boolean;

ALTER TABLE
    comments
ADD
    COLUMN is_deleted boolean;

-- migrate:down
ALTER TABLE
    users DROP COLUMN is_deleted;

ALTER TABLE
    teamsusersmapping DROP COLUMN is_deleted boolean;

ALTER TABLE
    projects DROP COLUMN is_deleted boolean;

ALTER TABLE
    tasks DROP COLUMN is_deleted boolean;

ALTER TABLE
    comments DROP COLUMN is_deleted boolean;