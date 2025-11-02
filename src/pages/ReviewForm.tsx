import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { Restaurant } from '../types';
import StarRating from '../components/StarRating';
import './ReviewForm.css';

export default function ReviewForm() {
  const { restaurantId, reviewId } = useParams<{ restaurantId: string; reviewId?: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (restaurantId) {
      fetchRestaurant();
    }

    if (reviewId) {
      fetchReview();
    }
  }, [restaurantId, reviewId, user]);

  const fetchRestaurant = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        navigate('/');
        return;
      }

      setRestaurant(data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    }
  };

  const fetchReview = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', reviewId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        navigate(`/restaurant/${restaurantId}`);
        return;
      }

      if (data.user_id !== user?.id) {
        navigate(`/restaurant/${restaurantId}`);
        return;
      }

      setRating(data.rating);
      setTitle(data.title);
      setComment(data.comment);
    } catch (error) {
      console.error('Error fetching review:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      setError('You must be signed in to submit a review');
      setLoading(false);
      return;
    }

    if (!title.trim() || !comment.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      if (reviewId) {
        const { error } = await supabase
          .from('reviews')
          .update({
            rating,
            title,
            comment,
            updated_at: new Date().toISOString(),
          })
          .eq('id', reviewId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('reviews').insert({
          restaurant_id: restaurantId,
          user_id: user.id,
          rating,
          title,
          comment,
        });

        if (error) throw error;
      }

      navigate(`/restaurant/${restaurantId}`);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      setError(error.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) {
    return (
      <div className="container py-6 text-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="review-form-page">
      <div className="container py-6">
        <div className="review-form-container fade-in">
          <div className="review-form-header">
            <h1>{reviewId ? 'Edit Your Review' : 'Write a Review'}</h1>
            <h2 className="restaurant-name-subtitle">{restaurant.name}</h2>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label className="form-label">Your Rating</label>
              <div className="rating-selector">
                <StarRating value={rating} onChange={setRating} size="large" />
                <span className="rating-label">{rating} star{rating !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Review Title
              </label>
              <input
                type="text"
                id="title"
                className="form-control"
                placeholder="Sum up your experience in a few words"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="comment">
                Your Review
              </label>
              <textarea
                id="comment"
                className="form-control"
                placeholder="Share your thoughts about the food, service, ambiance, and overall experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={8}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(`/restaurant/${restaurantId}`)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : reviewId ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
