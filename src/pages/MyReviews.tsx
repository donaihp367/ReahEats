import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { ReviewWithRestaurant } from '../types';
import StarRating from '../components/StarRating';
import './MyReviews.css';

export default function MyReviews() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewWithRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchMyReviews();
  }, [user]);

  const fetchMyReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, restaurants(*)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.filter((r) => r.id !== reviewId));
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

  return (
    <div className="my-reviews-page">
      <div className="container py-6">
        <div className="page-header fade-in">
          <h1>My Reviews</h1>
          <p className="page-subtitle">Manage all your restaurant reviews in one place</p>
        </div>

        {reviews.length > 0 ? (
          <div className="my-reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="my-review-card fade-in">
                <Link to={`/restaurant/${review.restaurant_id}`} className="review-restaurant-link">
                  <img
                    src={review.restaurants.image_url}
                    alt={review.restaurants.name}
                    className="review-restaurant-image"
                  />
                  <div className="review-restaurant-info">
                    <h3 className="review-restaurant-name">{review.restaurants.name}</h3>
                    <p className="review-restaurant-cuisine">{review.restaurants.cuisine}</p>
                  </div>
                </Link>

                <div className="review-content">
                  <div className="review-rating-date">
                    <StarRating value={review.rating} readonly size="small" />
                    <span className="review-date-text">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="review-title-text">{review.title}</h4>
                  <p className="review-comment-text">{review.comment}</p>

                  <div className="review-card-actions">
                    <Link
                      to={`/restaurant/${review.restaurant_id}/review/${review.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit Review
                    </Link>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="btn btn-outline btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-card fade-in">
            <div className="empty-state-icon">📝</div>
            <h2>No Reviews Yet</h2>
            <p>You haven't written any reviews yet. Start exploring restaurants and share your experiences!</p>
            <Link to="/" className="btn btn-primary mt-3">
              Discover Restaurants
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
