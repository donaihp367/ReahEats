import { Link } from 'react-router-dom';
import { Restaurant } from '../types';
import './RestaurantCard.css';

interface RestaurantCardProps {
  restaurant: Restaurant;
  averageRating?: number;
  reviewCount?: number;
}

export default function RestaurantCard({ restaurant, averageRating, reviewCount }: RestaurantCardProps) {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="restaurant-card-link">
      <div className="card restaurant-card fade-in">
        <div className="restaurant-card-image-wrapper">
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="card-img restaurant-card-image"
          />
          <div className="restaurant-cuisine-badge">{restaurant.cuisine}</div>
        </div>
        <div className="card-body">
          <h3 className="card-title">{restaurant.name}</h3>
          <p className="restaurant-location">
            <span className="location-icon">📍</span>
            {restaurant.city}
          </p>

          {averageRating !== undefined && (
            <div className="restaurant-rating-info">
              <div className="rating-stars">
                {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
              </div>
              <span className="rating-text">
                {averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          <p className="card-text restaurant-description">
            {restaurant.description.substring(0, 120)}
            {restaurant.description.length > 120 ? '...' : ''}
          </p>
        </div>
      </div>
    </Link>
  );
}
