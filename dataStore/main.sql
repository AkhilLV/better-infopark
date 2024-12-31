CREATE TABLE IF NOT EXISTS jobs(
    job_id INT,
    job_title TEXT,
    job_link TEXT,
    company_name TEXT,
    company_link TEXT,
    last_date DATE,
    date_added TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trivia(
    id INT,
    last_updated TIMESTAMP,
    new_jobs
);

INSERT INTO trivia(id, last_updated, new_jobs) VALUES (1, '2020-02-02', 0)