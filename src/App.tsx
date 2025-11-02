import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RestaurantDetail from './pages/RestaurantDetail';
import ReviewForm from './pages/ReviewForm';
import MyReviews from './pages/MyReviews';
import Auth from './pages/Auth';
import About from './pages/About';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
              <Route path="/restaurant/:restaurantId/review" element={<ReviewForm />} />
              <Route path="/restaurant/:restaurantId/review/:reviewId" element={<ReviewForm />} />
              <Route path="/my-reviews" element={<MyReviews />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
