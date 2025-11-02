import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { Restaurant, Review } from '../types';
import StarRating from '../components/StarRating';
import './RestaurantDetail.css';

interface ReviewWithUser extends Review {
  user_email?: string;
}

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (id) {
      fetchRestaurantAndReviews();
    }
  }, [id]);

  const fetchRestaurantAndReviews = async () => {
    try {
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (restaurantError) throw restaurantError;
      if (!restaurantData) {
        navigate('/');
        return;
      }

      setRestaurant(restaurantData);

      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('restaurant_id', id)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      const reviewsWithEmails = await Promise.all(
        (reviewsData || []).map(async (review) => {
          const { data: userData } = await supabase.auth.admin.getUserById(review.user_id);
          return {
            ...review,
            user_email: userData?.user?.email || 'Anonymous',
          };
        })
      );

      setReviews(reviewsWithEmails);

      if (reviewsData && reviewsData.length > 0) {
        const avg = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
        setAverageRating(avg);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.filter((r) => r.id !== reviewId));

      const remainingReviews = reviews.filter((r) => r.id !== reviewId);
      if (remainingReviews.length > 0) {
        const avg = remainingReviews.reduce((sum, review) => sum + review.rating, 0) / remainingReviews.length;
        setAverageRating(avg);
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="container py-6 text-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!restaurant) {
    return null;
  }

  return (
    <div className="restaurant-detail-page">
      <div className="restaurant-hero">
        <img src={restaurant.image_url} alt={restaurant.name} className="restaurant-hero-image" />
        <div className="restaurant-hero-overlay">
          <div className="container">
            <div className="restaurant-hero-content">
              <h1 className="restaurant-name fade-in">{restaurant.name}</h1>
              <div className="restaurant-meta fade-in">
                <span className="cuisine-tag">{restaurant.cuisine}</span>
                <span className="location-text">📍 {restaurant.city}</span>
              </div>
              {reviews.length > 0 && (
                <div className="restaurant-rating-summary fade-in">
                  <StarRating value={Math.round(averageRating)} readonly size="large" />
                  <span className="rating-summary-text">
                    {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="restaurant-info-section">
          <div className="info-card">
            <h2>About</h2>
            <p className="restaurant-description-full">{restaurant.description}</p>
            <p className="restaurant-address">
              <strong>Address:</strong> {restaurant.address}, {restaurant.city}
            </p>
          </div>

          {user && (
            <Link to={`/restaurant/${restaurant.id}/review`} className="btn btn-primary btn-add-review">
              Write a Review
            </Link>
          )}
          {!user && (
            <div className="auth-prompt">
              <p>
                <Link to="/auth">Sign in</Link> to write a review
              </p>
            </div>
          )}
        </div>

        <div className="reviews-section mt-6">
          <h2 className="reviews-title">Reviews</h2>

          {reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-card fade-in">
                  <div className="review-header">
                    <div className="review-author-info">
                      <div className="review-author-avatar">
                        {review.user_email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="review-author">{review.user_email}</p>
                        <p className="review-date">
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <StarRating value={review.rating} readonly size="small" />
                  </div>

                  <h3 className="review-title">{review.title}</h3>
                  <p className="review-comment">{review.comment}</p>

                  {user && user.id === review.user_id && (
                    <div className="review-actions">
                      <Link
                        to={`/restaurant/${restaurant.id}/review/${review.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="btn btn-outline btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-reviews">
              <p>No reviews yet. Be the first to review this restaurant!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
