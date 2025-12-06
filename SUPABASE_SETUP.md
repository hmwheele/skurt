# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Project Name**: excursion-hub (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait for it to initialize

## 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

3. Update your `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Run the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `/supabase/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create:
- `profiles` table (user profiles)
- `saved_excursions` table (saved excursions)
- `trip_plans` table (multi-day trip plans)
- `trip_plan_items` table (excursions within trip plans)
- `booking_history` table (tracking clicked bookings)
- `user_ratings` table (user reviews)
- All necessary Row Level Security policies
- Indexes for performance
- Automatic profile creation trigger

## 4. Configure Authentication

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable **Email** provider (enabled by default)
3. Optional: Enable other providers (Google, GitHub, etc.)

## 5. Verify Setup

1. Go to **Table Editor** in Supabase
2. You should see all tables: `profiles`, `saved_excursions`, `trip_plans`, `trip_plan_items`, `booking_history`, `user_ratings`
3. Go to **Authentication** → **Policies** to verify Row Level Security is enabled

## Database Schema Overview

### Tables

- **profiles**: User profile information (extends auth.users)
- **saved_excursions**: User's saved excursions from various providers
- **trip_plans**: Multi-day trip plans with name and date range
- **trip_plan_items**: Individual excursions assigned to specific days in a trip
- **booking_history**: Tracks when users click affiliate links
- **user_ratings**: User reviews and ratings for excursions

### Security

All tables have Row Level Security (RLS) enabled, ensuring users can only access their own data.

## Next Steps

Once Supabase is set up:
1. Restart your Next.js dev server to pick up the new environment variables
2. Test authentication by signing up
3. Verify that user profiles are created automatically
