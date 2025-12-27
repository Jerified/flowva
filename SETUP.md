# Flowva Rewards Hub - Setup Guide

This guide will help you set up the Flowva Rewards Hub with full Supabase integration.

## 🚀 Quick Start (Demo Mode)

The application works out of the box in **demo mode** with mock data. Simply:

```bash
npm install
npm run dev
```

Visit: `http://localhost:3000/dashboard/earn-rewards`

You'll see a demo mode banner with sample data. To enable full functionality, follow the steps below.

---

## 📦 Full Setup with Supabase

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Project Name**: `flowva-rewards` (or any name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
4. Click "Create new project" and wait ~2 minutes

### Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Open `SUPABASE_SCHEMA.md` in this project
4. Copy the entire SQL content
5. Paste into the SQL Editor
6. Click "Run" (or press Ctrl/Cmd + Enter)

You should see success messages for:
- ✅ Tables created (profiles, rewards, redemptions, featured_tools, points_transactions)
- ✅ RLS policies enabled
- ✅ Functions created (claim_daily_checkin, redeem_reward)

### Step 3: Enable Authentication

1. Go to **Authentication** > **Providers** in Supabase dashboard
2. Enable **Email** provider (should be enabled by default)
3. Optional: Configure email templates in **Authentication** > **Email Templates**

### Step 4: Seed Sample Data

In the SQL Editor, run this to add sample rewards:

```sql
-- Insert sample rewards
insert into rewards (name, description, points_cost, category, status) values
  ('$5 Amazon Gift Card', 'Redeem for a $5 Amazon gift card', 5000, 'gift_card', 'active'),
  ('$10 Amazon Gift Card', 'Redeem for a $10 Amazon gift card', 10000, 'gift_card', 'active'),
  ('$25 Amazon Gift Card', 'Redeem for a $25 Amazon gift card', 25000, 'gift_card', 'active'),
  ('Free Udemy Course', 'Get access to any Udemy course', 7500, 'course', 'active'),
  ('Premium Feature Access', 'Unlock premium features for 1 month', 15000, 'premium', 'active'),
  ('Exclusive Swag Pack', 'Limited edition Flowva merchandise', 20000, 'swag', 'coming_soon');

-- Insert featured tool
insert into featured_tools (name, description, signup_url, points_reward, is_active) values
  ('Reclaim.ai', 'Automate and Optimize Your Schedule. Reclaim.ai is an AI-powered calendar assistant that helps you find time for what matters.', 'https://reclaim.ai', 50, true);
```

### Step 5: Get API Credentials

1. Go to **Project Settings** (gear icon) > **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### Step 6: Configure Environment Variables

1. In your project root, create `.env.local`:

```bash
# Windows
copy .env.local.example .env.local

# Mac/Linux
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Important**: Never commit `.env.local` to git!

### Step 7: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

The demo mode banner should now disappear, and you'll have full functionality!

---

## 🧪 Testing the Features

### Create a Test User

1. Go to `http://localhost:3000/dashboard/earn-rewards`
2. You'll need to implement a signup page, or use Supabase dashboard:
   - Go to **Authentication** > **Users**
   - Click "Add user" > "Create new user"
   - Enter email and password
   - Click "Create user"

### Test Daily Check-in

1. The streak widget will show a "Check In Today" button
2. Click it to earn +5 points
3. Your streak count and points should update

### Test Reward Redemption

1. Switch to "Redeem Rewards" tab
2. Try to claim a reward (you'll need 5000+ points)
3. Use SQL to give yourself points for testing:

```sql
update profiles 
set total_points = 10000 
where email = 'your-test-email@example.com';
```

4. Refresh the page and try claiming again

### Test Referral System

1. Your unique referral code is displayed in the "Invite Friends" section
2. Click "COPY CODE" to test the copy functionality
3. Share the link: `https://app.flowvahub.com/signup/?ref=YOUR-CODE`

---

## 🔧 Troubleshooting

### "Demo Mode Active" banner still showing

- ✅ Check `.env.local` exists in project root
- ✅ Verify credentials are correct (no extra spaces)
- ✅ Restart dev server completely
- ✅ Check browser console for errors

### Database errors

- ✅ Verify all SQL from `SUPABASE_SCHEMA.md` ran successfully
- ✅ Check RLS policies are enabled
- ✅ Ensure functions were created

### Authentication issues

- ✅ Email provider must be enabled in Supabase
- ✅ Check if user exists in Authentication > Users
- ✅ Verify user has a profile row (should auto-create)

### Points not updating

- ✅ Check browser console for errors
- ✅ Verify `claim_daily_checkin` function exists
- ✅ Check `points_transactions` table for logs

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)

---

## 🎯 Next Steps

After setup, you can:

1. **Customize Rewards**: Add your own rewards in the `rewards` table
2. **Adjust Point Values**: Modify point costs and rewards in database
3. **Add More Features**: Implement leaderboards, badges, etc.
4. **Deploy**: Push to Vercel and add environment variables there

---

## 💡 Tips

- Use Supabase's **Table Editor** for easy data management
- Check **Logs** in Supabase for debugging
- Use **Database** > **Replication** to backup your data
- Set up **Edge Functions** for complex business logic

---

Need help? Check the main [README.md](./README.md) or open an issue!
