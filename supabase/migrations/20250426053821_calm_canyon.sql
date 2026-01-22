/*
  # Make description field optional
  
  1. Changes
    - Modify expenses table to make description nullable
    - Modify incomes table to make description nullable
*/

ALTER TABLE expenses ALTER COLUMN description DROP NOT NULL;
ALTER TABLE incomes ALTER COLUMN description DROP NOT NULL;