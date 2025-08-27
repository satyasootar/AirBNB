

# API Documentation

## Overview
This API provides endpoints for managing users, hotels, and reviews.  
It follows RESTful principles and uses JSON for request and response bodies.  

---

## Authentication
- Authentication is required for certain endpoints.
- Add `Authorization: AIRBNB <token>` in the header for protected routes.

---

## Endpoints
### 📌 Endpoints Overview
### 🔹 Listings

```
GET /api/listings/ → List all hotels

POST /api/listings/ → Create new listing

GET /api/listings/{id}/ → Retrieve hotel details

PUT /api/listings/{id}/ → Update listing

PATCH /api/listings/{id}/ → Partially update listing

DELETE /api/listings/{id}/ → Delete listing
```

### 🔹 Images
```

POST /api/listings/{id}/images/ → Upload hotel images
```

### 🔹 Reviews
```

GET /api/listings/{id}/reviews/ → List reviews for a hotel

POST /api/listings/{id}/reviews/ → Add a review

GET /api/listings/{id}/reviews/{id}/ → Get review details

PUT /api/listings/{id}/reviews/{id}/ → Update review

PATCH /api/listings/{id}/reviews/{id}/ → Partially update review

DELETE /api/listings/{id}/reviews/{id}/ → Delete review
```

### 🔹 Bookings
```

GET /api/bookings/ → List all bookings

POST /api/bookings/ → Create a booking

GET /api/bookings/{id}/ → Retrieve booking details

PUT /api/bookings/{id}/ → Update booking

PATCH /api/bookings/{id}/ → Partially update booking

DELETE /api/bookings/{id}/ → Cancel booking
```


### 🔹 Payments

# GET : bookings/

```

GET /api/bookings/payments/{id}/ → Retrieve payment

PUT /api/bookings/payments/{id}/ → Update payment

DELETE /api/bookings/payments/{id}/ → Delete payment

```

## 🏗️ Data Models
### Hotel Listing

```
{
    "id": 2,
    "title": "Layla",
    "description": "Amazing %-start Hotels with bunch of Stuff to do like swimming , jogging , Sitting at lakeside anything you want",
    "multiple_rooms": 10,
    "rooms": [
        {
            "id": 1,
            "bedroom": 2,
            "bathroom": 2,
            "beds": 4,
            "guest": 8,
            "booked_from": null,
            "booked_to": null,
            "is_reserved": true
        }
    ],
    "location": {
        "id": 2,
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India"
    },
    "address": "Near the Beach , Bombay Nagar , Mumbai",
    "price_per_night": 45000,
    "offersOrExtras": [
        "Wi-Fi",
        "Foods",
        "Door-to-Door servvices",
        "Airport Services",
        "swimming",
        "Beach"
    ],
    "reviews": [
        {
            "id": 12,
            "hotel": 2,
            "user": {
                "id": 4,
                "username": "swayam",
                "email": "swayam@gmail.com",
                "role": "GU"
            },
            "rating": 5,
            "cleanliness": 3,
            "location": 4,
            "service": 4,
            "comment": "Overall a must visit place keeps the vibes as said Calm , Toned , Peaceful Vibes  , Best for its Price",
            "created_at": "2025-08-27T20:44:43.753606Z"
        }
    ],
    "created_at": "2025-08-27T20:32:35.898965Z",
    "updated_at": "2025-08-27T20:32:35.898980Z",
    "host": {
        "id": 3,
        "username": "rahul",
        "email": "",
        "role": "HO"
    },
    "images": [
        {
            "id": 18,
            "url": "http://res.cloudinary.com/dghzubwry/image/upload/v1756327027/kninhtxxmj1wkw2te1ev.avif"
        },
        {
            "id": 19,
            "url": "http://res.cloudinary.com/dghzubwry/image/upload/v1756327028/ohinhokunyhn7bnpjzd4.avif"
        },
        {
            "id": 20,
            "url": "http://res.cloudinary.com/dghzubwry/image/upload/v1756327029/c7im9xbuhmmwfcagww4x.avif"
        },
        {
            "id": 21,
            "url": "http://res.cloudinary.com/dghzubwry/image/upload/v1756327030/uvsvqqbvacii4xgavazd.avif"
        },
        {
            "id": 22,
            "url": "http://res.cloudinary.com/dghzubwry/image/upload/v1756327030/sbbirxzmzry69eet3icp.avif"
        },
        {
            "id": 23,
            "url": "http://res.cloudinary.com/dghzubwry/image/upload/v1756327031/u7jcicvn0thefnpbhbjq.avif"
        },
        {
            "id": 24,
            "url": "http://res.cloudinary.com/dghzubwry/image/upload/v1756327032/a5yf3h38aqiw54gzexsq.avif"
        },
        {
            "id": 25,
            "url": "http://res.cloudinary.com/dghzubwry/image/upload/v1756327033/oetqdjkmwzfwuphvka44.avif"
        },
        {
            "id": 26,
            "url": "http://res.cloudinary.com/dghzubwry/image/upload/v1756327034/mg4fngsqdtpxxe0oerca.avif"
        },
        {
            "id": 27,
            "url": "http://res.cloudinary.com/dghzubwry/image/upload/v1756327035/w5ydrnksxzgheehdgvvr.avif"
        },
        {
            "id": 28,
            "url": "http://res.cloudinary.com/dghzubwry/image/upload/v1756327035/ehgx4te22rfmljgjterd.webp"
        },
        {
            "id": 29,
            "url": "http://res.cloudinary.com/dghzubwry/image/upload/v1756327036/tzof5mpoeodvvh85wqn8.avif"
        },
        {
            "id": 30,
            "url": "http://res.cloudinary.com/dghzubwry/image/upload/v1756327037/opska6deher2ehpy6jnw.avif"
        }
    ]
}}
```
### Booking
```
        {
            "id": 22,
            "listing": 1,
            "listing_info": {
                "id": 1,
                "title": "Mayfair",
                "address": "InfoCity Sq. , Bhubaneshwar",
                "price_per_night": 19000,
                "host": {
                    "id": 7,
                    "username": "swayam21",
                    "email": "swayam1@gamil.com",
                    "role": "HO"
                }
            },
            "user": {
                "id": 3,
                "username": "rahul",
                "email": ""
            },
            "check_in": "2025-09-18",
            "check_out": "2025-09-23",
            "guests": 5,
            "total_price": "95000.00",
            "status": "confirmed",
            "nights": 5,
            "created_at": "2025-08-26T19:27:25.565493Z",
            "updated_at": "2025-08-26T19:27:25.565512Z"
        }
```
### Review
```
{
            "id": 10,
            "hotel": 1,
            "user": {
                "id": 4,
                "username": "swayam",
                "email": "swayam@gmail.com",
                "role": "GU"
            },
            "rating": 4,
            "cleanliness": 3,
            "location": 2,
            "service": 4,
            "comment": "Quite Good Exprience  gave good vibes and luxirioius lifestyle as i was there for 1 week",
            "created_at": "2025-08-27T19:55:50.826616Z"
        }
```
### Payment
```
{
    "id": 22,
    "booking": 22,
    "amount": "95000.00",
    "status": "paid",
    "payment_method": "UPI",
    "provider_payment_id": "agwdiuaw 3743 i3tu t89 3 4 45985 gifdsdv",
    "created_at": "2025-08-26T19:27:25.568564Z"
}
```
## ⚡ Setup

- Clone the repo

- Install dependencies


- Configure PostgreSQL & Django environment

### Run migrations:
```
python manage.py makemigrations

python manage.py migrate
```

### Start server:
```
python manage.py runserver
```

```

