export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  city: string;
  image_url: string;
  description: string;
  created_at: string;
}

export interface Review {
  id: string;
  restaurant_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewWithRestaurant extends Review {
  restaurants: Restaurant;
}

export interface User {
  id: string;
  email: string;
}
