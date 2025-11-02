import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="logo-icon">🍽️</span>
          <span className="logo-text">ReahEats</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          {user && <Link to="/my-reviews" className="nav-link">My Reviews</Link>}
          <Link to="/about" className="nav-link">About</Link>

          {user ? (
            <div className="navbar-user">
              <span className="user-email">{user.email}</span>
              <button onClick={handleSignOut} className="btn btn-secondary btn-sm">
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
