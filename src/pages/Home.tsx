import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Restaurant } from '../types';
import RestaurantCard from '../components/RestaurantCard';
import './Home.css';

interface RestaurantWithStats extends Restaurant {
  averageRating: number;
  reviewCount: number;
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<RestaurantWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from('restaurants')
        .select('*')
        .order('name');

      if (restaurantsError) throw restaurantsError;

      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('restaurant_id, rating');

      if (reviewsError) throw reviewsError;

      const restaurantsWithStats = (restaurantsData || []).map((restaurant) => {
        const restaurantReviews = (reviewsData || []).filter(
          (review: any) => review.restaurant_id === restaurant.id
        );
        const averageRating = restaurantReviews.length
          ? restaurantReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / restaurantReviews.length
          : 0;

        return {
          ...restaurant,
          averageRating,
          reviewCount: restaurantReviews.length,
        };
      });

      restaurantsWithStats.sort((a, b) => b.averageRating - a.averageRating);
      setRestaurants(restaurantsWithStats);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container py-6 text-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title fade-in">Discover Your Next Favorite Restaurant</h1>
            <p className="hero-subtitle fade-in">Read reviews from food lovers and share your own dining experiences</p>

            <div className="search-box fade-in">
              <input
                type="text"
                className="search-input"
                placeholder="Search by restaurant name, cuisine, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        </div>
      </section>

      <section className="restaurants-section py-6">
        <div className="container">
          <h2 className="section-title">
            {searchTerm ? 'Search Results' : 'Top Rated Restaurants'}
          </h2>

          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-3">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  averageRating={restaurant.averageRating}
                  reviewCount={restaurant.reviewCount}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-state-text">No restaurants found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
