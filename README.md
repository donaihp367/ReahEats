# ReahEats - Restaurant Review Platform

ReahEats is a modern, full-stack restaurant review platform that allows users to discover restaurants, read reviews from fellow food enthusiasts, and share their own dining experiences.

## Features

### Core Functionality
- **Restaurant Discovery**: Browse a curated collection of restaurants with high-quality images
- **Smart Search**: Filter restaurants by name, cuisine type, or location
- **User Authentication**: Secure email/password authentication system
- **Review Management**: Full CRUD operations for restaurant reviews
- **Star Ratings**: Interactive 5-star rating system
- **User Profiles**: Personal dashboard to manage all your reviews

### Five Main Pages
1. **Home Page**: Features top-rated restaurants with search functionality
2. **Restaurant Detail Page**: View restaurant information and all associated reviews
3. **My Reviews Page**: Manage all your personal reviews in one place
4. **Review Form Page**: Create and edit reviews with ratings
5. **About Page**: Learn about the platform and its features

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Custom CSS** with modern design system
- **Bootstrap** for layout utilities

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** database with Row Level Security (RLS)
- **Real-time data synchronization**

### Design
- Modern, sophisticated UI with custom color palette
- Smooth animations and transitions
- Fully responsive design (mobile and desktop)
- High-quality stock photos from Pexels
- Custom star rating component

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd project
```

2. Install dependencies
```bash
npm install
```

3. Environment variables are pre-configured in `.env`

4. Start the development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Database Schema

### Tables

#### Restaurants
- id (uuid, primary key)
- name (text)
- cuisine (text)
- address (text)
- city (text)
- image_url (text)
- description (text)
- created_at (timestamp)

#### Reviews
- id (uuid, primary key)
- restaurant_id (uuid, foreign key)
- user_id (uuid, foreign key)
- rating (integer, 1-5)
- title (text)
- comment (text)
- created_at (timestamp)
- updated_at (timestamp)

### Security
- Row Level Security (RLS) enabled on all tables
- Public read access for restaurants and reviews
- Authenticated users can create reviews
- Users can only edit/delete their own reviews

## Features Walkthrough

### Authentication
- Sign up with email and password
- Secure sign-in system
- Protected routes for authenticated users
- Automatic session management

### Restaurant Discovery
- Browse all restaurants on the home page
- View average ratings and review counts
- Search and filter functionality
- Click any restaurant to view details

### Review System
- Create reviews with star ratings and detailed comments
- Edit your existing reviews
- Delete reviews you no longer want
- View all your reviews on the My Reviews page

### User Experience
- Smooth fade-in animations
- Hover effects on interactive elements
- Loading states for async operations
- Error handling with user-friendly messages
- Responsive design for all screen sizes

## Design Principles

The application follows modern UI/UX best practices:

- **Clean Lines**: Minimalist design with intentional white space
- **Color Palette**: Professional gradient backgrounds with orange primary color
- **Typography**: Playfair Display for headings, Inter for body text
- **Spacing**: Consistent 8px spacing system
- **Shadows**: Layered shadows for depth and hierarchy
- **Transitions**: Smooth animations for better user experience

## Project Structure

```
project/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── StarRating.tsx
│   │   └── RestaurantCard.tsx
│   ├── pages/           # Main application pages
│   │   ├── Home.tsx
│   │   ├── RestaurantDetail.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── MyReviews.tsx
│   │   ├── Auth.tsx
│   │   └── About.tsx
│   ├── lib/             # Utilities and configuration
│   │   ├── supabase.ts
│   │   └── AuthContext.tsx
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Application entry point
│   └── styles.css       # Global styles
├── public/              # Static assets
└── package.json
```

## License

ISC

## Acknowledgments

- Restaurant photos from Pexels
- Built with React, Vite, and Supabase
- Designed and developed as a full-stack portfolio project
