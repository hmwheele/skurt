-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Create saved_excursions table
create table if not exists public.saved_excursions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  provider text not null,
  excursion_id text not null,
  excursion_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, provider, excursion_id)
);

alter table public.saved_excursions enable row level security;

create policy "Users can view their own saved excursions"
  on public.saved_excursions for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own saved excursions"
  on public.saved_excursions for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own saved excursions"
  on public.saved_excursions for delete
  using ( auth.uid() = user_id );

-- Create trip_plans table
create table if not exists public.trip_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  destination text,
  start_date date not null,
  end_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.trip_plans enable row level security;

create policy "Users can view their own trip plans"
  on public.trip_plans for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own trip plans"
  on public.trip_plans for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own trip plans"
  on public.trip_plans for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own trip plans"
  on public.trip_plans for delete
  using ( auth.uid() = user_id );

-- Create trip_plan_items table
create table if not exists public.trip_plan_items (
  id uuid default uuid_generate_v4() primary key,
  trip_plan_id uuid references public.trip_plans on delete cascade not null,
  day_number integer not null,
  provider text not null,
  excursion_id text not null,
  excursion_data jsonb not null,
  time_of_day text,
  notes text,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.trip_plan_items enable row level security;

create policy "Users can view items from their own trip plans"
  on public.trip_plan_items for select
  using (
    exists (
      select 1 from public.trip_plans
      where trip_plans.id = trip_plan_items.trip_plan_id
      and trip_plans.user_id = auth.uid()
    )
  );

create policy "Users can insert items to their own trip plans"
  on public.trip_plan_items for insert
  with check (
    exists (
      select 1 from public.trip_plans
      where trip_plans.id = trip_plan_items.trip_plan_id
      and trip_plans.user_id = auth.uid()
    )
  );

create policy "Users can update items in their own trip plans"
  on public.trip_plan_items for update
  using (
    exists (
      select 1 from public.trip_plans
      where trip_plans.id = trip_plan_items.trip_plan_id
      and trip_plans.user_id = auth.uid()
    )
  );

create policy "Users can delete items from their own trip plans"
  on public.trip_plan_items for delete
  using (
    exists (
      select 1 from public.trip_plans
      where trip_plans.id = trip_plan_items.trip_plan_id
      and trip_plans.user_id = auth.uid()
    )
  );

-- Create booking_history table
create table if not exists public.booking_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  provider text not null,
  excursion_id text not null,
  excursion_data jsonb not null,
  affiliate_link text not null,
  clicked_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.booking_history enable row level security;

create policy "Users can view their own booking history"
  on public.booking_history for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own booking history"
  on public.booking_history for insert
  with check ( auth.uid() = user_id );

-- Create user_ratings table
create table if not exists public.user_ratings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  provider text not null,
  excursion_id text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  review text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, provider, excursion_id)
);

alter table public.user_ratings enable row level security;

create policy "Users can view their own ratings"
  on public.user_ratings for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own ratings"
  on public.user_ratings for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own ratings"
  on public.user_ratings for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own ratings"
  on public.user_ratings for delete
  using ( auth.uid() = user_id );

-- Create indexes for better performance
create index if not exists idx_saved_excursions_user_id on public.saved_excursions(user_id);
create index if not exists idx_trip_plans_user_id on public.trip_plans(user_id);
create index if not exists idx_trip_plan_items_trip_plan_id on public.trip_plan_items(trip_plan_id);
create index if not exists idx_booking_history_user_id on public.booking_history(user_id);
create index if not exists idx_user_ratings_user_id on public.user_ratings(user_id);

-- Create function to handle user profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically create profile on user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
