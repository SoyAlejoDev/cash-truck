/*
  # Initial Schema Setup for TruckerFinance

  1. New Tables
    - `weeks`
      - `id` (uuid, primary key)
      - `start_date` (date)
      - `end_date` (date)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)

    - `expenses`
      - `id` (uuid, primary key)
      - `week_id` (uuid, references weeks)
      - `date` (date)
      - `amount` (decimal)
      - `category` (text)
      - `description` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)

    - `incomes`
      - `id` (uuid, primary key)
      - `week_id` (uuid, references weeks)
      - `date` (date)
      - `amount` (decimal)
      - `description` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create weeks table
CREATE TABLE weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date date NOT NULL,
  end_date date NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_week_dates CHECK (end_date >= start_date)
);

-- Create expenses table
CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id uuid NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  date date NOT NULL,
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  category text NOT NULL CHECK (category IN ('fuel', 'maintenance', 'other')),
  description text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create incomes table
CREATE TABLE incomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id uuid NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  date date NOT NULL,
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  description text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;

-- Create policies for weeks
CREATE POLICY "Users can manage their own weeks"
  ON weeks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for expenses
CREATE POLICY "Users can manage their own expenses"
  ON expenses
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for incomes
CREATE POLICY "Users can manage their own incomes"
  ON incomes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX weeks_user_id_idx ON weeks(user_id);
CREATE INDEX weeks_date_range_idx ON weeks(start_date, end_date);
CREATE INDEX expenses_week_id_idx ON expenses(week_id);
CREATE INDEX expenses_user_id_idx ON expenses(user_id);
CREATE INDEX incomes_week_id_idx ON incomes(week_id);
CREATE INDEX incomes_user_id_idx ON incomes(user_id);