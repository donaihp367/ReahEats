import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <div className="container py-6">
        <div className="about-hero fade-in">
          <h1>About ReahEats</h1>
          <p className="about-tagline">
            Your trusted community for authentic restaurant reviews and culinary discoveries
          </p>
        </div>

        <div className="about-content">
          <section className="about-section fade-in">
            <div className="about-section-icon">🍽️</div>
            <h2>Our Mission</h2>
            <p>
              ReahEats was created to help food lovers discover exceptional dining experiences and share their
              honest opinions about restaurants. We believe that authentic reviews from real diners are the best
              way to find your next favorite meal.
            </p>
          </section>

          <section className="about-section fade-in">
            <div className="about-section-icon">⭐</div>
            <h2>What We Offer</h2>
            <p>
              Our platform makes it easy to browse restaurants, read detailed reviews from fellow food
              enthusiasts, and contribute your own experiences. Whether you're looking for a cozy cafe, an
              upscale dining experience, or authentic ethnic cuisine, ReahEats helps you make informed decisions.
            </p>
          </section>

          <section className="about-section fade-in">
            <div className="about-section-icon">👥</div>
            <h2>Community First</h2>
            <p>
              ReahEats is built on the principle that great food experiences should be shared. Our community of
              reviewers takes pride in providing honest, helpful feedback that benefits everyone. Join us in
              creating a trustworthy resource for food lovers everywhere.
            </p>
          </section>

          <section className="about-features fade-in">
            <h2>Platform Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3>Smart Search</h3>
                <p>Find restaurants by name, cuisine type, or location</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📝</div>
                <h3>Easy Reviews</h3>
                <p>Share your experiences with our simple review system</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Real-Time Ratings</h3>
                <p>See up-to-date ratings based on community feedback</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Mobile Friendly</h3>
                <p>Access ReahEats seamlessly on any device</p>
              </div>
            </div>
          </section>

          <section className="about-cta fade-in">
            <h2>Join Our Community</h2>
            <p>
              Start exploring restaurants, reading reviews, and sharing your own dining experiences today.
              Together, we can build the most reliable resource for food lovers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
