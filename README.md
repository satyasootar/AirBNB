<!-- Add Api references  -->
# POST : listings/
```
 {
    "title": "Mayfair",
    "description": "A beautiful and Peaceful View from the terrace with the most luxiriousity in the entireity of Bhubaneshwar",
    "multiple_rooms": 5,
    "rooms": [{
"bedroom":2,
"bathroom":2,
"beds":4,
"guest":7,
}],
    "location": {
        "city": "Bhubaneshwar",
        "state": "Odisha",
        "country": "India"
    },
    "address": "InfoCity Sq. , Bhubaneshwar",
    "price_per_night": 19000,
    "offersOrExtras": ["Wi-Fi" , "Foods" , "Door-to-Door servvices" , "Airport Services"]
}
```

# POST : reviews
```
{ 
    "rating": 5,
    "comment": "It was Quite a Good Exprince with someone"
}
```

# GET : bookings/
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


# POST : bookings/payments/{DB-id}
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
