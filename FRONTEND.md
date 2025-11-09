# 🏡 Airbnb Clone — Frontend

A modern, high-performance **Airbnb-inspired accommodation booking frontend** built with a **lean React + Vite stack**.  
The project focuses on delivering a **smooth booking experience**, **authenticated user flows**, and **responsive, app-like interactions** — demonstrating production-grade frontend design and architectural skills.

---

## ✨ Frontend Overview

This frontend is a **feature-rich React application** emulating the Airbnb experience.  
It implements **real-world patterns** like token-based authentication, trip management, and search-driven booking flows — all built with **React 19 concurrent APIs**, **Tailwind CSS**, and **Framer Motion** for subtle animations.

---

## 🧪 Tech Stack

| Category | Tools / Libraries |
|-----------|-------------------|
| **Framework** | React 19 (Concurrent-ready APIs), React DOM |
| **Routing** | React Router DOM v7 (Nested dynamic routes `/room/:id`, `/trips/details/:bookingId`) |
| **Bundler / Dev** | Vite 7 (ESM, blazing-fast HMR) |
| **Styling** | Tailwind CSS v4 via `@tailwindcss/vite` (Utility-first, responsive design) |
| **Icons & Visuals** | Heroicons, Lucide, React-Icons |
| **Animation** | Framer Motion (Micro-interactions, transitions) |
| **Media / Carousel** | React Slick + Slick Carousel assets |
| **Forms & Dates** | react-datepicker for intuitive date selection |
| **Notifications** | React Toastify (Auth & booking feedback) |
| **HTTP Client** | Axios with interceptors (Token handling + 401 refresh) |
| **State Management** | Custom Context (StoreContext) + React hooks + useRef persistence |
| **Deployment** | SPA-friendly routing with `vercel.json` rewrites |

---

## 🔐 Authentication & Session Handling

- **Email / Password** authentication (signup & login)  
- **Access + Refresh tokens** stored securely in `localStorage`  
- Automatic token injection via `Authorization: AIRBNB <access>` scheme  
- **401 Interceptor** triggers refresh flow (`/api/token/refresh/`)  
- **User hydration** on reload (`/api/auth/me/`) with cleanup via `AbortController`  
- **Graceful logout** clears tokens, user data, and cached state  

---

## 🧭 Core User Flows (Routes)

| Route | Description |
|--------|--------------|
| `/` | Landing page + Search bar (mobile + desktop adaptive) |
| `/:city` | Dynamic search results for selected city |
| `/room/:id` | Room details view (gallery, amenities, reviews) |
| `/reservation` | Booking summary & confirmation staging |
| `/confirmation` | Post-booking success screen |
| `/auth` | Unified Auth (Login / Signup) |
| `/trips` | User’s bookings overview |
| `/trips/details/:bookingId` | Detailed trip view (payments, host info) |
| `/profile` | Profile management (listings, favorites, avatar upload) |
| `/host` | Host dashboard (future extension for property management) |

---

## 🧱 Architectural Highlights

- **Single Axios Gateway** for consistent headers, retries, and token lifecycle  
- **Context Provider** centralizing hotels, trips, user sessions, and booking/search state  
- **Dynamic Search Suggestions** (derived from fetched hotel data)  
- **Error Handling Layer** that normalizes server responses and network errors  
- **Ref-based transient state** to prevent unnecessary re-renders  
- **Local Persistence** with defensive JSON parsing & fallback cleanup  
- **AbortController Integration** to cancel stale async operations  

---

## 🖥️ Responsive UI / UX Features

- Smart **Hide-on-Scroll Navbar** for immersive browsing  
- Dual-mode **Search Bar** (mobile overlay + desktop inline)  
- **Guest Selector** with outside-click detection  
- Dynamic guest label synthesis (“Add guests” → “2 guests”)  
- Animated **Room & Gallery Carousels**  
- **Toast-driven feedback** for auth, errors, and booking outcomes  
- Clean **component architecture** for Navbar, Search, Cards, and Layout  

---

## 💳 Booking Workflow

1. User selects destination, dates, and guests on the home page  
2. Redirected to **dynamic city results** (`/:city`)  
3. Selects a room → navigates to `/room/:id`  
4. Reviews reservation details → `/reservation`  
5. Booking API triggers **POST then PATCH** for payment confirmation  
6. Trips refreshed (`/trips`) with updated booking state  
7. Smooth transition to **Trip Details** and **Confirmation Screen**

---

## 🧪 Error Handling Strategy

- Unified error extractor (handles `detail`, `message`, and field-level errors)  
- Differentiates **server**, **network**, and **setup** errors  
- **401 Auto-logout** ensures session integrity  
- Toast-based real-time feedback for user clarity  

---

## ⚙️ Coding Practices & Strengths Demonstrated

- Clear **separation of concerns** (Context, Views, Utilities)  
- **Interceptor-based Auth Lifecycle** (Refresh token pattern)  
- Defensive **localStorage handling** with validation & cleanup  
- **Optimistic UI updates** for snappy experience  
- **Concurrent rendering awareness** (React 19 APIs)  
- **Reusable modular Navbar system** demonstrating composition  
- Awareness of **memory & cancellation** via `AbortController`  
- Strong **frontend-backend integration** patterns  
- Consistent **Tailwind utility styling** ensuring scalability  

---

## 📈 Future Enhancements

- Route-based **code splitting / lazy loading**  
- **Accessibility** improvements (ARIA roles, keyboard navigation)  
- **Offline caching** with Service Workers / Workbox  
- Schema-based form validation using **Zod** or **Yup**  
- Image optimization & **skeleton loaders**  
- Automated testing with **Jest + React Testing Library**

---

## 🖼️ Screenshots

| Screen | Preview |
|--------|----------|
| **Home / Search Bar** | ![home-search](./public/screenshots/home-search.png) |
| **City Results** | ![city-results](./public/screenshots/city-results.png) |
| **Room Detail** | ![room-detail](./public/screenshots/room-detail.png) |
| **Reservation Flow** | ![reservation](./public/screenshots/reservation.png) |
| **Trips Dashboard** | ![trips](./public/screenshots/trips.png) |
| **Trip Details** | ![trip-details](./public/screenshots/trip-details.png) |
| **Profile Page** | ![profile](./public/screenshots/profile.png) |
| **Mobile Search Overlay** | ![mobile-search](./public/screenshots/mobile-search.png) |

---

## 🧑‍💻 Developer Insight

This project highlights **production-grade frontend skills**, showcasing:
- Advanced React architecture and context management  
- UX thinking with responsive and adaptive layouts  
- Integration of authentication flows with backend APIs  
- Clean code organization and scalability mindset  

> Designed & Developed by **[Satya Prangya Sootar](https://github.com/satyasootar)**  
> B-Tech CSE | Full-Stack Developer | Passionate about scalable web experiences  

---
