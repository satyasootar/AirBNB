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

## 🖼️ Screenshots in laptop view

| Screen | Preview |
|--------|---------|
| **Home / Search Bar** | ![home-search](https://github.com/user-attachments/assets/ebf70d0a-3734-456f-95da-3716ced44da6) |
| **City Results** | ![city-results](https://github.com/user-attachments/assets/066b8c06-0220-47af-8591-1a0b2f5e939c) |
| **Room Detail** | ![room-detail](https://github.com/user-attachments/assets/f13c0593-f2fb-427d-b0f4-73153f0035f9) |
| **Reservation Flow** | ![reservation](https://github.com/user-attachments/assets/8950fc8b-2a2f-4864-b14a-1f38760c778a) |
| **Trips Dashboard** | ![trips](https://github.com/user-attachments/assets/a89fc6aa-224a-4e21-8695-58054d2d3065) |
| **Trip Details** | ![trip-details](https://github.com/user-attachments/assets/54064a34-2502-430b-8631-dcea5eac04ec) |
| **Profile Page** | ![profile](https://github.com/user-attachments/assets/663a2188-f22b-402c-8c96-d1d4a8848a4d) |
| **Host Dashboard** | ![mobile-search](https://github.com/user-attachments/assets/b0d001e8-6c07-4cbe-a4e4-f2eae455ec0f) |


## 🖼️ Screenshots in Mobile view

| Screen | Preview |
|--------|---------|
| **Home / Search Bar** | ![home-search](https://github.com/user-attachments/assets/fe43f9e8-fcc0-4076-8fd8-1e3ca28ccbe8) |
| **City Results** | ![city-results](https://github.com/user-attachments/assets/4502d393-6701-496d-9164-415d50586955) |
| **Room Detail** | ![room-detail](https://github.com/user-attachments/assets/976f5106-45d6-4ea7-89c8-3f7819f484f1) |
| **Reservation Flow** | ![reservation](https://github.com/user-attachments/assets/c8744caa-1753-40a3-9c4d-7ec68de0d7d5) |
| **Trips Dashboard** | ![trips](https://github.com/user-attachments/assets/62d58d4a-e113-44ef-97d4-58ebe6fe964c) |
| **Trip Details** | ![trip-details](https://github.com/user-attachments/assets/593beb14-7095-4a3a-86cf-ea391c973f02) |
| **Profile Page** | ![profile](https://github.com/user-attachments/assets/608d644e-1c24-431b-bd4d-f75f34566bd6) |
| **Host Dashboard** | ![mobile-search](https://github.com/user-attachments/assets/b85e2d46-80b6-4c37-93b3-a0588678553b) |



## 🧑‍💻 Developer Insight

This project highlights **production-grade frontend skills**, showcasing:
- Advanced React architecture and context management  
- UX thinking with responsive and adaptive layouts  
- Integration of authentication flows with backend APIs  
- Clean code organization and scalability mindset  

> Designed & Developed by **[Satya Prangya Sootar](https://github.com/satyasootar)**  
> B-Tech CSE | Full-Stack Developer | Passionate about scalable web experiences  

---
