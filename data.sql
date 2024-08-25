\c biztime

DROP TABLE IF EXISTS industries_companies;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries(
    code text PRIMARY KEY,
    industry text NOT NULL UNIQUE
);

CREATE TABLE industries_companies(
  id serial PRIMARY KEY,
  industry_code text NOT NULL REFERENCES industries ON DELETE CASCADE,
  comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE
);

INSERT INTO companies (code, name, description)
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.'),
         ('sofo', 'sofo foods','processed food and catering company'),
         ('pepsi', 'pepsi cola', 'soda company based in north carolina');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries (code, industry)
  VALUES('it', 'information technology'),
  ('rd', 'research and development'),
  ('bev', 'beverage services'),
  ('food', 'food services'),
  ('hosp', 'hospitality and lodging');

INSERT INTO industries_companies (industry_code, comp_code)
VALUES
('rd','apple'),
('it','apple'),
('rd','ibm'),
('it','ibm'),
('bev','pepsi'),
('food','sofo'),
('bev','sofo');





































-- \c biztime

-- -- Drop existing tables if they exist
-- DROP TABLE IF EXISTS invoices;
-- DROP TABLE IF EXISTS companies;
-- DROP TABLE IF EXISTS industries;
-- DROP TABLE IF EXISTS industries_companies;

-- -- Create tables with correct syntax
-- CREATE TABLE companies (
--     code text PRIMARY KEY,
--     name text NOT NULL UNIQUE,
--     description text
-- );

-- CREATE TABLE invoices (
--     id serial PRIMARY KEY,
--     comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
--     amt numeric NOT NULL, -- Changed to numeric for financial precision
--     paid boolean DEFAULT false NOT NULL,
--     add_date date DEFAULT CURRENT_DATE NOT NULL,
--     paid_date date,
--     CONSTRAINT invoices_amt_check CHECK (amt > 0) -- Updated constraint
-- );

-- CREATE TABLE industries (
--     code text PRIMARY KEY,
--     industry text NOT NULL UNIQUE
-- );

-- CREATE TABLE industries_companies (
--     id serial PRIMARY KEY,
--     industry_code text NOT NULL REFERENCES industries ON DELETE CASCADE,
--     comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE
-- );

-- -- Insert data with correct string literal syntax
-- INSERT INTO companies (code, name, description)
--   VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
--          ('ibm', 'IBM', 'Big blue.'),
--          ('sofo', 'sofo foods', 'processed food and catering company'),
--          ('pepsi', 'pepsi cola', 'soda company based in north carolina');

-- INSERT INTO invoices (comp_code, amt, paid, paid_date)
--   VALUES ('apple', 100, false, NULL),
--          ('apple', 200, false, NULL),
--          ('apple', 300, true, '2018-01-01'),
--          ('ibm', 400, false, NULL);

-- INSERT INTO industries (code, industry)
--   VALUES ('it', 'information technology'),
--          ('rd', 'research and development'),
--          ('bev', 'beverage services'),
--          ('food', 'food services'),
--          ('hosp', 'hospitality and lodging');

-- INSERT INTO industries_companies (industry_code, comp_code)
--   VALUES ('rd', 'apple'),
--          ('it', 'apple'),
--          ('rd', 'ibm'),
--          ('it', 'ibm'),
--          ('bev', 'pepsi'),
--          ('food', 'sofo'),
--          ('bev', 'sofo');

