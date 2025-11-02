/*
  # ReahEats Database Schema

  ## Overview
  Creates the core database structure for the ReahEats restaurant review platform.
  
  ## New Tables
  
  ### `restaurants`
  - `id` (uuid, primary key) - Unique identifier for each restaurant
  - `name` (text) - Restaurant name
  - `cuisine` (text) - Type of cuisine (Italian, Mexican, etc.)
  - `address` (text) - Physical address
  - `city` (text) - City location
  - `image_url` (text) - Photo URL from Pexels
  - `description` (text) - Restaurant description
  - `created_at` (timestamptz) - When restaurant was added
  
  ### `reviews`
  - `id` (uuid, primary key) - Unique identifier for each review
  - `restaurant_id` (uuid, foreign key) - Links to restaurants table
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `rating` (integer) - Star rating (1-5)
  - `title` (text) - Review title/headline
  - `comment` (text) - Review text content
  - `created_at` (timestamptz) - When review was created
  - `updated_at` (timestamptz) - When review was last updated
  
  ## Security
  - Row Level Security (RLS) enabled on both tables
  - Restaurants: Public read access, no public write
  - Reviews: Public read, authenticated users can create/read/update/delete their own reviews
  
  ## Important Notes
  1. Uses Supabase auth.users for user management
  2. Reviews can only be modified by their creators
  3. Average ratings calculated dynamically via queries
  4. Cascade delete reviews when restaurant is deleted
*/

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cuisine text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  image_url text NOT NULL,
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  comment text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for restaurants table

CREATE POLICY "Anyone can view restaurants"
  ON restaurants
  FOR SELECT
  USING (true);

-- RLS Policies for reviews table

CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_city ON restaurants(city);
