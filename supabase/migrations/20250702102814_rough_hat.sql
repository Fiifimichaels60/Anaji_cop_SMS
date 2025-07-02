/*
  # Church SMS System Database Schema

  1. New Tables
    - `members`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `phone` (text, required)
      - `email` (text, optional)
      - `group_id` (uuid, foreign key)
      - `active` (boolean, default true)
      - `join_date` (date, default today)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `groups`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `description` (text)
      - `color` (text, default '#3B82F6')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `messages`
      - `id` (uuid, primary key)
      - `content` (text, required)
      - `status` (text, default 'pending')
      - `total_recipients` (integer, default 0)
      - `delivered_count` (integer, default 0)
      - `sent_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `message_recipients`
      - `id` (uuid, primary key)
      - `message_id` (uuid, foreign key)
      - `member_id` (uuid, foreign key)
      - `status` (text, default 'pending')
      - `delivered_at` (timestamp)
      - `created_at` (timestamp)
    
    - `message_groups`
      - `id` (uuid, primary key)
      - `message_id` (uuid, foreign key)
      - `group_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `sms_templates`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `content` (text, required)
      - `category` (text, default 'General')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their church data
*/

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  group_id uuid REFERENCES groups(id) ON DELETE SET NULL,
  active boolean DEFAULT true,
  join_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  total_recipients integer DEFAULT 0,
  delivered_count integer DEFAULT 0,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create message_recipients table
CREATE TABLE IF NOT EXISTS message_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create message_groups table
CREATE TABLE IF NOT EXISTS message_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create sms_templates table
CREATE TABLE IF NOT EXISTS sms_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'General',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can manage groups"
  ON groups
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage members"
  ON members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage message recipients"
  ON message_recipients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage message groups"
  ON message_groups
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage SMS templates"
  ON sms_templates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_group_id ON members(group_id);
CREATE INDEX IF NOT EXISTS idx_members_active ON members(active);
CREATE INDEX IF NOT EXISTS idx_message_recipients_message_id ON message_recipients(message_id);
CREATE INDEX IF NOT EXISTS idx_message_recipients_member_id ON message_recipients(member_id);
CREATE INDEX IF NOT EXISTS idx_message_groups_message_id ON message_groups(message_id);
CREATE INDEX IF NOT EXISTS idx_message_groups_group_id ON message_groups(group_id);

-- Insert default groups
INSERT INTO groups (name, description, color) VALUES
  ('Adult Ministry', 'Adult congregation members', '#3B82F6'),
  ('Youth Ministry', 'Young adults and teenagers', '#10B981'),
  ('Choir', 'Church choir members', '#8B5CF6'),
  ('Volunteers', 'Church volunteers and staff', '#F59E0B')
ON CONFLICT DO NOTHING;

-- Insert default SMS templates
INSERT INTO sms_templates (name, content, category) VALUES
  ('Sunday Service Reminder', 'Don''t forget about our Sunday service at 10 AM. We look forward to seeing you there! God bless.', 'Reminder'),
  ('Event Invitation', 'You''re invited to our special church event on [DATE] at [TIME]. Join us for fellowship and worship!', 'Invitation'),
  ('Prayer Request', 'Please keep [NAME] in your prayers. God''s healing power is with us always.', 'Prayer'),
  ('Welcome Message', 'Welcome to our church family! We''re blessed to have you join us. God bless your journey with us.', 'Welcome'),
  ('Meeting Reminder', 'Reminder: [GROUP] meeting tomorrow at [TIME]. See you there!', 'Reminder')
ON CONFLICT DO NOTHING;