

# 🏡 AirBNB API Documentation

A comprehensive RESTful API for managing **authentication**, **hotel listings**, **reviews**, and **bookings** for an Airbnb-style application.

---

## 🔐 Authentication Endpoints (`/api/auth/`)

### **POST** `/api/auth/login/`

Authenticate a user session (login).

**Authentication:** None (public endpoint)

**Status Code:** `200 OK`

#### Request

```json
{
  "email": "xyz@gmail.com",
  "password": "xyz@123"
}
```

#### Response

```json
{
  "refresh": "<JWT_REFRESH_TOKEN>",
  "access": "<JWT_ACCESS_TOKEN>"
}
```

---

### **GET** `/api/auth/me/`

Retrieve information about the current authenticated user.

**Authentication:** Requires JWT
**Status Code:** `200 OK`

---

### **PATCH** `/api/auth/me/`

Update the current authenticated user's information.

**Authentication:** Requires JWT
**Status Code:** `200 OK`

---

### **POST** `/api/auth/register/`

Register a new user account.

**Authentication:** None (public endpoint)
**Status Code:** `201 Created`

---

### **POST** `/api/token/refresh/`

Obtain a new access token using a valid refresh token.

**Authentication:** None (public endpoint)

**Request Body**

```json
{
  "refresh": "<JWT_REFRESH_TOKEN>"
}
```

---

## 🏠 Listings Endpoints (`/api/listings/`)

### **GET** `/api/listings/`

Retrieve a paginated list of hotel listings.

**Authentication:** Optional (JWT)
**Query Parameters:**

| Name            | Type    | Required | Description             |
| --------------- | ------- | -------- | ----------------------- |
| limit           | integer | No       | Results per page        |
| offset          | integer | No       | Pagination start index  |
| price_per_night | integer | No       | Filter by price         |
| location        | integer | No       | Filter by location ID   |
| title           | string  | No       | Filter by listing title |

#### Response

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Cozy Apartment",
      "description": "A comfortable two-bedroom apartment.",
      "multiple_rooms": 2,
      "rooms": [
        {
          "bedroom": 2,
          "bathroom": 1,
          "beds": 2,
          "guest": 4,
          "is_reserved": false
        }
      ],
      "location": {
        "id": 1,
        "city": "City",
        "state": "State",
        "country": "Country",
        "lat": "0",
        "lon": "0"
      },
      "address": "123 Main St",
      "price_per_night": 100,
      "offersOrExtras": ["Wifi", "TV"],
      "reviews": [],
      "host": "host@example.com",
      "images": []
    }
  ]
}
```

---

### **POST** `/api/listings/`

Create a new hotel listing.

**Authentication:** Requires JWT
**Status Code:** `201 Created`

#### Request

```json
{
  "title": "Cozy Apartment",
  "description": "A comfortable two-bedroom apartment.",
  "multiple_rooms": 2,
  "rooms": [
    { "bedroom": 2, "bathroom": 1, "beds": 2, "guest": 4, "is_reserved": false }
  ],
  "location": 1,
  "address": "123 Main St",
  "price_per_night": 100,
  "offersOrExtras": ["Wifi", "TV"]
}
```

---

### **GET** `/api/listings/{id}/`

Retrieve details of a specific listing.

**Authentication:** Optional (JWT)
**Path Parameter:** `id` (integer, required)

---

### **PATCH** `/api/listings/{id}/`

Update an existing listing.

**Authentication:** Requires JWT

#### Example Request

```json
{
  "price_per_night": 120,
  "offersOrExtras": ["Wifi", "TV", "Pool"]
}
```

---

### **POST** `/api/listings/{id}/images/`

Upload an image for a listing.
**Authentication:** Requires JWT
**Body:** `multipart/form-data` or JSON with image fields.

---

### **GET** `/api/listings/{id}/reviews/`

List all reviews for a listing.
**Authentication:** Optional
**Query Parameters:** `limit`, `offset`

#### Response Example

```json
{
  "count": 2,
  "results": [
    {
      "id": 10,
      "user": { "username": "swayam", "email": "swayam@gmail.com" },
      "rating": 4,
      "comment": "Quite Good Experience gave good vibes.",
      "created_at": "2025-08-27T19:55:50Z"
    }
  ]
}
```

---

### **POST** `/api/listings/{id}/reviews/`

Create a review for a listing.
**Authentication:** Requires JWT

#### Example Request

```json
{
  "rating": 5,
  "cleanliness": 4,
  "location": 4,
  "service": 5,
  "comment": "Excellent stay!"
}
```

---

### **DELETE** `/api/listings/{listing_id}/reviews/{review_id}/`

Delete a review by ID.
**Authentication:** Requires JWT
**Status Code:** `204 No Content`

---

### **GET** `/api/listings/hotels/`

Retrieve all hotel listings at once.
**Authentication:** Optional
**Status Code:** `200 OK`

---

## 📅 Bookings Endpoints (`/api/bookings/`)

### **GET** `/api/bookings/`

Retrieve a paginated list of **user bookings**.

**Authentication:** Requires JWT
**Status Code:** `200 OK`

#### Response

```json
{
  "count": 1,
  "results": [
    {
      "id": 38,
      "listing_info": {
        "title": "InterContinental Marine Drive-Mumbai",
        "price_per_night": 6500
      },
      "check_in": "2025-10-16",
      "check_out": "2025-10-18",
      "status": "confirmed",
      "total_price": "13000.00"
    }
  ]
}
```

---

### **GET** `/api/bookings/?role=host`

Retrieve all bookings for **hotels owned by the host**.

**Authentication:** Requires JWT

---

### **POST** `/api/bookings/`

Create a new booking.
**Authentication:** Requires JWT
**Status Code:** `201 Created`

#### Example Request

```json
{
  "listing": 1,
  "check_in": "2025-12-01",
  "check_out": "2025-12-05",
  "adult": 2,
  "children": 1,
  "infant": 0,
  "total_price": "500.00"
}
```

---

### **GET** `/api/bookings/{id}/`

Retrieve a specific booking by ID.
**Authentication:** Requires JWT
**Status Code:** `200 OK`

---

### **PATCH** `/api/bookings/{id}/`

Update booking payment details.

#### Example Request

```json
{
  "payment": {
    "status": "paid",
    "payment_method": "paypal",
    "provider_payment_id": "pay_me_pay_abc6969"
  }
}
```

---

### **DELETE** `/api/bookings/{id}/`

Delete a booking.
**Authentication:** Requires JWT
**Status Code:** `204 No Content`

---

## 🧾 Summary of Endpoints

| Category     | Endpoints                                                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Auth**     | `/api/auth/login/`, `/api/auth/me/`, `/api/auth/register/`, `/api/token/refresh/`                                             |
| **Listings** | `/api/listings/`, `/api/listings/{id}/`, `/api/listings/{id}/images/`, `/api/listings/{id}/reviews/`, `/api/listings/hotels/` |
| **Bookings** | `/api/bookings/`, `/api/bookings/?role=host`, `/api/bookings/{id}/`                                                           |

---

