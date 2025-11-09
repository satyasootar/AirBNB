# 🏡 Airbnb Clone - Full Stack Accommodation Booking Platform

A production-grade, full-stack accommodation booking application inspired by Airbnb, featuring a modern React frontend and a robust Django REST API backend. This project demonstrates enterprise-level architecture, authentication flows, real-time booking management, and responsive design principles.

> **Designed & Developed by Satya Prangya Sootar**  
> B-Tech CSE | Full-Stack Developer | Passionate about scalable web experiences

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Frontend Routes](#-frontend-routes)
- [Authentication Flow](#-authentication-flow)
- [Future Enhancements](#-future-enhancements)

---

## 🎯 Overview

This project is a feature-complete Airbnb clone that enables users to:
- **Search and discover** accommodations by location, price, and amenities
- **Book stays** with intuitive date selection and guest management
- **Manage trips** with detailed booking history and status tracking
- **Review properties** with ratings across multiple dimensions
- **Host listings** with property management capabilities

The application showcases modern web development practices including JWT authentication, RESTful API design, responsive UI/UX, and optimized performance patterns.

---

## ✨ Features

### User Experience
- 🔍 **Smart Search** - Dynamic city suggestions with filters for price, dates, and guests
- 📅 **Date Selection** - Intuitive calendar interface with availability checking
- 🏠 **Property Discovery** - Rich listing cards with images, ratings, and amenities
- 💳 **Seamless Booking** - Multi-step reservation flow with payment integration
- 📊 **Trip Management** - Comprehensive dashboard for past and upcoming bookings
- ⭐ **Review System** - Multi-dimensional ratings (cleanliness, location, service)
- 👤 **Profile Management** - Avatar uploads, favorites, and account settings

### Technical Capabilities
- 🔐 **Secure Authentication** - JWT-based auth with automatic token refresh
- 🚀 **High Performance** - React 19 concurrent rendering, Vite HMR
- 📱 **Fully Responsive** - Mobile-first design with adaptive layouts
- 🎨 **Smooth Animations** - Framer Motion micro-interactions
- 🛡️ **Error Handling** - Comprehensive error states and user feedback
- 🔄 **Real-time Updates** - Optimistic UI with server synchronization
- 📡 **API Integration** - Axios interceptors for token lifecycle management

---

## 🛠️ Tech Stack

### Frontend
| Category | Technology |
|----------|-----------|
| **Framework** | React 19 (Concurrent APIs) |
| **Routing** | React Router DOM v7 |
| **Build Tool** | Vite 7 (ESM) |
| **Styling** | Tailwind CSS v4 |
| **Animation** | Framer Motion |
| **HTTP Client** | Axios |
| **State Management** | Context API + Custom Hooks |
| **UI Components** | Heroicons, Lucide, React Slick |
| **Form Handling** | react-datepicker |
| **Notifications** | React Toastify |

### Backend
| Category | Technology |
|----------|-----------|
| **Framework** | Django REST Framework |
| **Authentication** | JWT (JSON Web Tokens) |
| **Database** | PostgreSQL / SQLite |
| **API Architecture** | RESTful |
| **File Uploads** | Multipart Form Data |

---

## 🏗️ Architecture

### Frontend Architecture

```
frontend/
├── public/
│   ├── assets/              # Static images and icons
│   │   ├── balloon.png
│   │   ├── beachsearch.png
│   │   ├── bell.png
│   │   ├── citysearch.png
│   │   ├── guest_fav.png
│   │   ├── host.png
│   │   ├── leaf.png
│   │   └── mountainsearch.png
│   └── logo/                # Brand assets
│       ├── Airbnb_Logo_0.svg
│       ├── Airbnb_Logo_1.png
│       ├── Airbnb_Logo_2.webp
│       └── symbol.svg
│
└── src/
    ├── components/
    │   ├── Navbar/          # Navigation system
    │   │   ├── DesktopSearchBar.jsx
    │   │   ├── MobileExpandedSearch.jsx
    │   │   ├── MobileSearchTrigger.jsx
    │   │   ├── Navbar.jsx
    │   │   └── TopNavbar.jsx
    │   ├── Profile/         # Profile management
    │   │   ├── FavoritesTab.jsx
    │   │   ├── ListingsTab.jsx
    │   │   ├── ProfileEditForm.jsx
    │   │   ├── ProfileHeader.jsx
    │   │   ├── ProfileImageUpload.jsx
    │   │   ├── ProfileTabs.jsx
    │   │   ├── TripCard_Profile.jsx
    │   │   └── TripsTab.jsx
    │   ├── Room/            # Property detail components
    │   │   ├── AboutPlace.jsx
    │   │   ├── GuestFavourite.jsx
    │   │   └── HotelGallery.jsx
    │   ├── Trips/           # Booking management
    │   │   ├── CancelModal.jsx
    │   │   ├── GuestInfoSection.jsx
    │   │   ├── HelpSection.jsx
    │   │   ├── HostInfoSection.jsx
    │   │   ├── PaymentSummary.jsx
    │   │   ├── TripCard.jsx
    │   │   ├── TripDetailsHeader.jsx
    │   │   ├── TripHeroSection.jsx
    │   │   ├── TripInfoCards.jsx
    │   │   ├── TripNotFound.jsx
    │   │   └── TripSkeleton.jsx
    │   ├── utils/           # Reusable utilities
    │   │   ├── Amenities.jsx
    │   │   ├── axiosInstance.js
    │   │   ├── CalculateDays.js
    │   │   ├── Card.jsx
    │   │   ├── createSearchItemsFromHotels.jsx
    │   │   ├── Features.jsx
    │   │   ├── GuestFavCard.jsx
    │   │   ├── Header.jsx
    │   │   ├── HeartButton.jsx
    │   │   ├── Loader.jsx
    │   │   ├── Profile.jsx
    │   │   ├── RareFind.jsx
    │   │   ├── RatingIcon.jsx
    │   │   ├── RatingsBar.jsx
    │   │   ├── ReviewCard.jsx
    │   │   ├── ScrollButton.jsx
    │   │   ├── ScrollToTop.jsx
    │   │   ├── SearchCard.jsx
    │   │   ├── SearchCards.jsx
    │   │   └── seededValueInRange.jsx
    │   ├── BookingSummaryCard.jsx
    │   ├── CardCarousel.jsx
    │   ├── Footer.jsx
    │   ├── MapEmbed.jsx
    │   └── PaymentMethod.jsx
    │
    ├── context/             # Global state
    │   ├── StoreContext.js
    │   └── StoreContextProvider.jsx
    │
    ├── pages/               # Route views
    │   ├── Auth.jsx
    │   ├── Confirmation.jsx
    │   ├── Home.jsx
    │   ├── Host.jsx
    │   ├── Profile.jsx
    │   ├── Reservation.jsx
    │   ├── Room.jsx
    │   ├── SearchResults.jsx
    │   ├── TripDetails.jsx
    │   └── Trips.jsx
    │
    ├── routing/
    │   └── Routing.jsx      # React Router configuration
    │
    ├── App.jsx              # Root component
    ├── main.jsx             # Application entry point
    └── index.css            # Global styles
```

### Backend API Structure

```
backend/
└── airbnbapi/
    ├── airbnbapi/           # Core Django project
    │   ├── settings.py      # Configuration
    │   ├── urls.py          # Main URL routing
    │   ├── views.py         # Shared views
    │   ├── authentication.py # Custom auth backend
    │   ├── asgi.py
    │   ├── wsgi.py
    │   └── __init__.py
    │
    ├── users/               # User management app
    │   ├── models.py        # User model
    │   ├── serializers.py   # User serialization
    │   ├── views.py         # Auth endpoints
    │   ├── urls.py          # User routes
    │   ├── permissions.py   # Custom permissions
    │   ├── admin.py
    │   └── tests.py
    │
    ├── listings/            # Property management app
    │   ├── models.py        # Listing, Room, Review models
    │   ├── serializers.py   # Listing serialization
    │   ├── views.py         # Listing CRUD + reviews
    │   ├── urls.py          # Listing routes
    │   ├── permissions.py   # Host permissions
    │   ├── admin.py
    │   └── tests.py
    │
    ├── bookings/            # Booking management app
    │   ├── models.py        # Booking, Payment models
    │   ├── serializers.py   # Booking serialization
    │   ├── views.py         # Booking CRUD
    │   ├── urls.py          # Booking routes
    │   ├── permissions.py   # Booking permissions
    │   ├── admin.py
    │   └── tests.py
    │
    ├── manage.py            # Django management script
    ├── schema.yml           # OpenAPI schema
    ├── Procfile             # Deployment config
    ├── req.txt              # Python dependencies
    └── runtime.txt          # Python version
```

---

## 🧭 Frontend Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing page with search | No |
| `/:city` | Search results for city | No |
| `/room/:id` | Property details | No |
| `/reservation` | Booking summary | Yes |
| `/confirmation` | Booking success | Yes |
| `/auth` | Login/Signup | No |
| `/trips` | User's bookings | Yes |
| `/trips/details/:bookingId` | Booking details | Yes |
| `/profile` | User profile | Yes |
| `/host` | Host dashboard | Yes |

---

## 🔐 Authentication Flow

1. **User Login/Signup** → Receives access + refresh tokens
2. **Token Storage** → Stored securely in localStorage
3. **API Requests** → Access token auto-injected via Axios interceptor
4. **Token Expiry** → 401 response triggers refresh flow
5. **Token Refresh** → New access token obtained from `/api/token/refresh/`
6. **Request Retry** → Original request retried with new token
7. **Session Hydration** → User data fetched on app reload via `/api/auth/me/`
8. **Logout** → Tokens cleared, state reset, redirect to home


---

## 📈 Future Enhancements

### Performance
- [ ] Route-based code splitting and lazy loading
- [ ] Image optimization with WebP/AVIF formats
- [ ] Service Worker for offline support
- [ ] Skeleton loaders for improved perceived performance

### Features
- [ ] Real-time availability calendar
- [ ] Chat system for guest-host communication
- [ ] Advanced filters (amenities, property type)
- [ ] Wishlists and saved searches
- [ ] Multi-currency support
- [ ] Email notifications

### Technical
- [ ] Unit and integration testing (Jest, React Testing Library)
- [ ] E2E testing with Playwright
- [ ] Schema validation with Zod
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Analytics integration
- [ ] CI/CD pipeline

---

## 📄 License

This project is for educational and portfolio purposes.

---

## 🙏 Acknowledgments

- Inspired by Airbnb's user experience design
- Built with best practices from React, Django, and REST API communities
- Special thanks to open-source contributors of all libraries used

---

**⭐ If you found this project helpful, please consider giving it a star!**