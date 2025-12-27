# Flowva Rewards Hub - Supabase Database Schema

This document outlines the database structure needed for the Flowva Rewards Hub technical assessment.

## Database Tables

### 1. `profiles`
Stores user profile and rewards data.

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  total_points integer default 0,
  streak_count integer default 0,
  last_check_in_date date,
  referral_code text unique,
  total_referrals integer default 0,
  referral_points_earned integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Policy: Users can view their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Policy: Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

### 2. `rewards`
Catalog of available rewards.

```sql
create table rewards (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  points_cost integer not null,
  category text not null, -- 'gift_card', 'course', 'premium', etc.
  status text default 'active', -- 'active', 'coming_soon', 'disabled'
  image_url text,
  external_link text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table rewards enable row level security;

-- Policy: Anyone can view active rewards
create policy "Anyone can view rewards"
  on rewards for select
  using (true);
```

### 3. `redemptions`
Tracks when users claim rewards.

```sql
create table redemptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  reward_id uuid references rewards(id) on delete cascade not null,
  redeemed_at timestamp with time zone default now(),
  status text default 'pending' -- 'pending', 'completed', 'failed'
);

-- Enable RLS
alter table redemptions enable row level security;

-- Policy: Users can view their own redemptions
create policy "Users can view own redemptions"
  on redemptions for select
  using (auth.uid() = user_id);

-- Policy: Users can create redemptions
create policy "Users can create redemptions"
  on redemptions for insert
  with check (auth.uid() = user_id);
```

### 4. `featured_tools`
Dynamic content for the featured tool spotlight.

```sql
create table featured_tools (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  logo_url text,
  signup_url text,
  points_reward integer default 50,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table featured_tools enable row level security;

-- Policy: Anyone can view active featured tools
create policy "Anyone can view featured tools"
  on featured_tools for select
  using (is_active = true);
```

### 5. `points_transactions`
Audit log for all point changes.

```sql
create table points_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  points_change integer not null, -- positive for earning, negative for spending
  transaction_type text not null, -- 'daily_checkin', 'referral', 'redemption', 'share_stack', etc.
  description text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table points_transactions enable row level security;

-- Policy: Users can view their own transactions
create policy "Users can view own transactions"
  on points_transactions for select
  using (auth.uid() = user_id);
```

## Database Functions

### Daily Check-in Function

```sql
create or replace function claim_daily_checkin(user_id_param uuid)
returns json
language plpgsql
security definer
as $$
declare
  current_profile profiles%rowtype;
  points_to_add integer := 5;
  result json;
begin
  -- Get current profile
  select * into current_profile from profiles where id = user_id_param;
  
  -- Check if already checked in today
  if current_profile.last_check_in_date = current_date then
    return json_build_object(
      'success', false,
      'message', 'Already checked in today'
    );
  end if;
  
  -- Update streak
  if current_profile.last_check_in_date = current_date - interval '1 day' then
    -- Continue streak
    update profiles
    set streak_count = streak_count + 1,
        last_check_in_date = current_date,
        total_points = total_points + points_to_add,
        updated_at = now()
    where id = user_id_param;
  else
    -- Reset streak
    update profiles
    set streak_count = 1,
        last_check_in_date = current_date,
        total_points = total_points + points_to_add,
        updated_at = now()
    where id = user_id_param;
  end if;
  
  -- Log transaction
  insert into points_transactions (user_id, points_change, transaction_type, description)
  values (user_id_param, points_to_add, 'daily_checkin', 'Daily check-in bonus');
  
  return json_build_object(
    'success', true,
    'points_earned', points_to_add,
    'message', 'Check-in successful!'
  );
end;
$$;
```

### Redeem Reward Function

```sql
create or replace function redeem_reward(user_id_param uuid, reward_id_param uuid)
returns json
language plpgsql
security definer
as $$
declare
  current_profile profiles%rowtype;
  reward_data rewards%rowtype;
  result json;
begin
  -- Get current profile and reward
  select * into current_profile from profiles where id = user_id_param;
  select * into reward_data from rewards where id = reward_id_param;
  
  -- Check if reward exists
  if reward_data.id is null then
    return json_build_object(
      'success', false,
      'message', 'Reward not found'
    );
  end if;
  
  -- Check if user has enough points
  if current_profile.total_points < reward_data.points_cost then
    return json_build_object(
      'success', false,
      'message', 'Insufficient points'
    );
  end if;
  
  -- Deduct points
  update profiles
  set total_points = total_points - reward_data.points_cost,
      updated_at = now()
  where id = user_id_param;
  
  -- Create redemption record
  insert into redemptions (user_id, reward_id)
  values (user_id_param, reward_id_param);
  
  -- Log transaction
  insert into points_transactions (user_id, points_change, transaction_type, description)
  values (user_id_param, -reward_data.points_cost, 'redemption', 'Redeemed: ' || reward_data.name);
  
  return json_build_object(
    'success', true,
    'message', 'Reward redeemed successfully!',
    'remaining_points', current_profile.total_points - reward_data.points_cost
  );
end;
$$;
```

## Setup Instructions

1. Create a new Supabase project at https://supabase.com
2. Run the SQL commands above in the Supabase SQL Editor
3. Enable Email/Password authentication in Supabase Auth settings
4. Copy your project URL and anon key to `.env.local`
5. Seed initial data (rewards, featured tools)

## Sample Data

```sql
-- Insert sample rewards
insert into rewards (name, description, points_cost, category, status) values
  ('$5 Amazon Gift Card', 'Redeem for a $5 Amazon gift card', 5000, 'gift_card', 'active'),
  ('$10 Amazon Gift Card', 'Redeem for a $10 Amazon gift card', 10000, 'gift_card', 'active'),
  ('Free Udemy Course', 'Get access to any Udemy course', 7500, 'course', 'active'),
  ('Premium Feature Access', 'Unlock premium features for 1 month', 15000, 'premium', 'coming_soon');

-- Insert featured tool
insert into featured_tools (name, description, signup_url, points_reward) values
  ('Reclaim.ai', 'Automate and Optimize Your Schedule. Reclaim.ai is an AI-powered calendar assistant.', 'https://reclaim.ai', 50);
```
