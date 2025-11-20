# ArtisanHub - API Specification
## RESTful API Documentation & Integration Guide

**Version:** 1.0  
**Last Updated:** November 17, 2025  
**Base URL:** `https://api.artisanhub.com/api/v1`

---

## Table of Contents
1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Endpoints](#endpoints)
6. [Response Formats](#response-formats)
7. [Webhook Events](#webhook-events)

---

## API Overview

### Key Features
- RESTful architecture with JSON requests/responses
- JWT-based authentication with refresh tokens
- Comprehensive error handling and logging
- Rate limiting per user/IP
- Pagination support for list endpoints
- Filtering and sorting capabilities
- Real-time updates via WebSocket (optional)

### API Versions
- **v1:** Current stable version (in use)
- **v2:** Planned with GraphQL support

### Base URL
```
Development: https://api-dev.artisanhub.local/api/v1
Staging: https://api-staging.artisanhub.com/api/v1
Production: https://api.artisanhub.com/api/v1
```

---

## Authentication

### Registration

**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "customer",
  "vendorType": null
}
```

**Role Options:**
- `customer` - Regular user
- `product_seller` - Product vendor
- `service_artisan` - Service provider
- `admin` - Admin user

**Response:** `200 OK`
```json
{
  "data": {
    "user": {
      "id": "usr_123abc",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "profileImageUrl": null,
      "isEmailVerified": false,
      "createdAt": "2025-11-17T10:30:00Z"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "message": "Registration successful"
}
```

### Login

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "data": {
    "user": {
      "id": "usr_123abc",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "profileImageUrl": "https://...",
      "isEmailVerified": true,
      "createdAt": "2025-11-17T10:30:00Z"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "message": "Login successful"
}
```

### Refresh Token

**Endpoint:** `POST /auth/refresh`

**Headers:**
```
Authorization: Bearer {refreshToken}
```

**Response:** `200 OK`
```json
{
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Logout

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`
```json
{
  "message": "Logout successful"
}
```

### Email Verification

**Endpoint:** `POST /auth/verify-email`

**Request:**
```json
{
  "email": "user@example.com",
  "token": "verification_token_123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Email verified successfully"
}
```

### Social Authentication (OAuth)

**Endpoint:** `POST /auth/social`

**Request:**
```json
{
  "provider": "google",
  "idToken": "google_id_token_here",
  "displayName": "John Doe",
  "email": "user@example.com",
  "profileImageUrl": "https://..."
}
```

**Providers:** `google`, `apple`, `facebook`

---

## Products API

### List Products

**Endpoint:** `GET /products`

**Query Parameters:**
```
?page=1&pageSize=20
&category=electronics
&sortBy=rating
&sortOrder=desc
&minPrice=10
&maxPrice=1000
&search=laptop
```

**Response:** `200 OK`
```json
{
  "data": {
    "items": [
      {
        "id": "prod_123abc",
        "vendorId": "vnd_456def",
        "name": "MacBook Pro 14",
        "description": "Powerful laptop for professionals",
        "price": 1999.99,
        "discount": 10,
        "imageUrls": ["https://...", "https://..."],
        "category": "electronics",
        "subcategories": ["computers", "laptops"],
        "stock": 50,
        "rating": 4.8,
        "reviewCount": 245,
        "variants": [
          {
            "id": "var_123",
            "name": "Storage",
            "values": ["256GB", "512GB", "1TB"],
            "priceModifier": {
              "512GB": 100,
              "1TB": 300
            }
          }
        ],
        "status": "active",
        "createdAt": "2025-11-10T00:00:00Z",
        "updatedAt": "2025-11-17T10:30:00Z"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "hasMore": true
  }
}
```

### Get Product Details

**Endpoint:** `GET /products/:productId`

**Response:** `200 OK`
```json
{
  "data": {
    "id": "prod_123abc",
    "vendorId": "vnd_456def",
    "name": "MacBook Pro 14",
    "description": "Powerful laptop for professionals",
    "price": 1999.99,
    "discount": 10,
    "imageUrls": ["https://...", "https://..."],
    "category": "electronics",
    "stock": 50,
    "rating": 4.8,
    "reviewCount": 245,
    "vendor": {
      "id": "vnd_456def",
      "businessName": "Tech Store",
      "rating": 4.7,
      "reviewCount": 1200
    },
    "reviews": [
      {
        "id": "rev_123",
        "customerId": "usr_xyz",
        "customerName": "Jane Smith",
        "rating": 5,
        "comment": "Excellent product, fast shipping",
        "imageUrls": [],
        "helpfulCount": 45,
        "createdAt": "2025-11-16T00:00:00Z"
      }
    ]
  }
}
```

### Create Product (Vendor)

**Endpoint:** `POST /products`

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "MacBook Pro 14",
  "description": "Powerful laptop for professionals",
  "price": 1999.99,
  "discount": 10,
  "category": "electronics",
  "subcategories": ["computers", "laptops"],
  "stock": 50,
  "variants": [
    {
      "name": "Storage",
      "values": ["256GB", "512GB", "1TB"],
      "priceModifier": {
        "512GB": 100,
        "1TB": 300
      }
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "data": {
    "id": "prod_123abc",
    "name": "MacBook Pro 14",
    "vendorId": "vnd_456def",
    "status": "active",
    "createdAt": "2025-11-17T10:30:00Z"
  },
  "message": "Product created successfully"
}
```

### Update Product

**Endpoint:** `PUT /products/:productId`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:** (Same as create, with partial updates allowed)

**Response:** `200 OK`
```json
{
  "data": {
    "id": "prod_123abc",
    "name": "MacBook Pro 14",
    "updatedAt": "2025-11-17T11:30:00Z"
  },
  "message": "Product updated successfully"
}
```

### Delete Product

**Endpoint:** `DELETE /products/:productId`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`
```json
{
  "message": "Product deleted successfully"
}
```

### Search Products

**Endpoint:** `POST /products/search`

**Request:**
```json
{
  "query": "laptop",
  "filters": {
    "category": "electronics",
    "minPrice": 100,
    "maxPrice": 5000,
    "rating": 4.5
  },
  "sortBy": "rating",
  "sortOrder": "desc",
  "page": 1,
  "pageSize": 20
}
```

**Response:** `200 OK` (Same format as list products)

---

## Services API

### List Services

**Endpoint:** `GET /services`

**Query Parameters:**
```
?page=1&pageSize=20
&category=beauty
&serviceType=home_service
&city=New York
&sortBy=rating
```

**Response:** `200 OK`
```json
{
  "data": {
    "items": [
      {
        "id": "svc_123abc",
        "vendorId": "vnd_456def",
        "name": "Professional Haircut",
        "description": "Expert haircut service",
        "category": "beauty",
        "basePrice": 50,
        "rating": 4.9,
        "reviewCount": 156,
        "imageUrls": ["https://..."],
        "estimatedDurationMinutes": 60,
        "packages": [
          {
            "id": "pkg_123",
            "name": "Basic Haircut",
            "description": "Simple haircut",
            "price": 50,
            "durationMinutes": 45,
            "features": ["haircut"]
          }
        ],
        "status": "active",
        "createdAt": "2025-11-10T00:00:00Z"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 500,
    "hasMore": true
  }
}
```

### Get Service Details

**Endpoint:** `GET /services/:serviceId`

**Response:** `200 OK`
```json
{
  "data": {
    "id": "svc_123abc",
    "vendorId": "vnd_456def",
    "name": "Professional Haircut",
    "description": "Expert haircut service",
    "category": "beauty",
    "basePrice": 50,
    "packages": [
      {
        "id": "pkg_123",
        "name": "Basic Haircut",
        "description": "Simple haircut",
        "price": 50,
        "durationMinutes": 45,
        "features": ["haircut"]
      }
    ],
    "vendor": {
      "id": "vnd_456def",
      "businessName": "Elite Salon",
      "rating": 4.8,
      "availabilityStatus": "available"
    },
    "reviews": [
      {
        "id": "rev_123",
        "customerId": "usr_xyz",
        "rating": 5,
        "comment": "Excellent service",
        "serviceDate": "2025-11-10T00:00:00Z",
        "createdAt": "2025-11-11T00:00:00Z"
      }
    ]
  }
}
```

### Create Service (Vendor)

**Endpoint:** `POST /services`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "name": "Professional Haircut",
  "description": "Expert haircut service",
  "category": "beauty",
  "basePrice": 50,
  "estimatedDurationMinutes": 60,
  "packages": [
    {
      "name": "Basic Haircut",
      "description": "Simple haircut",
      "price": 50,
      "durationMinutes": 45,
      "features": ["haircut"]
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "data": {
    "id": "svc_123abc",
    "name": "Professional Haircut",
    "vendorId": "vnd_456def",
    "status": "active"
  },
  "message": "Service created successfully"
}
```

---

## Availability API

### Get Availability

**Endpoint:** `GET /services/:serviceId/availability`

**Query Parameters:**
```
?startDate=2025-11-20&endDate=2025-11-30&timezone=America/New_York
```

**Response:** `200 OK`
```json
{
  "data": {
    "id": "avail_123abc",
    "serviceId": "svc_123abc",
    "vendorId": "vnd_456def",
    "availability": [
      {
        "dayOfWeek": 0,
        "dayName": "Monday",
        "timeSlots": [
          {
            "id": "ts_123",
            "startTime": "2025-11-17T09:00:00Z",
            "endTime": "2025-11-17T09:45:00Z",
            "isAvailable": true,
            "maxCapacity": 1,
            "currentBookings": 0
          },
          {
            "id": "ts_124",
            "startTime": "2025-11-17T10:00:00Z",
            "endTime": "2025-11-17T10:45:00Z",
            "isAvailable": true,
            "maxCapacity": 1,
            "currentBookings": 0
          }
        ]
      }
    ],
    "blockedDates": ["2025-12-25", "2025-01-01"]
  }
}
```

### Update Availability (Vendor)

**Endpoint:** `PUT /services/:serviceId/availability`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "dayOfWeek": 0,
  "timeSlots": [
    {
      "startTime": "09:00",
      "endTime": "17:00",
      "breakStartTime": "12:00",
      "breakEndTime": "13:00"
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "data": {
    "id": "avail_123abc",
    "updatedAt": "2025-11-17T10:30:00Z"
  },
  "message": "Availability updated successfully"
}
```

### Block Dates (Vendor)

**Endpoint:** `POST /services/:serviceId/block-dates`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "dates": ["2025-12-25", "2025-01-01"],
  "reason": "Holiday"
}
```

**Response:** `200 OK`
```json
{
  "message": "Dates blocked successfully"
}
```

---

## Bookings API

### Create Booking

**Endpoint:** `POST /bookings`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "serviceId": "svc_123abc",
  "servicePackageId": "pkg_123",
  "serviceDate": "2025-11-25",
  "timeSlotId": "ts_123",
  "quantity": 1,
  "addons": [
    {
      "id": "addon_123",
      "name": "Express Service",
      "price": 20
    }
  ],
  "notes": "Please arrive 5 minutes early"
}
```

**Response:** `201 Created`
```json
{
  "data": {
    "id": "bkg_123abc",
    "customerId": "usr_xyz",
    "vendorId": "vnd_456def",
    "serviceId": "svc_123abc",
    "serviceDate": "2025-11-25T14:00:00Z",
    "totalPrice": 70,
    "status": "pending",
    "confirmationCode": "AH-2025-11-17-001",
    "createdAt": "2025-11-17T10:30:00Z"
  },
  "message": "Booking created successfully"
}
```

### Get Booking Details

**Endpoint:** `GET /bookings/:bookingId`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`
```json
{
  "data": {
    "id": "bkg_123abc",
    "customerId": "usr_xyz",
    "vendorId": "vnd_456def",
    "serviceId": "svc_123abc",
    "serviceName": "Professional Haircut",
    "serviceDate": "2025-11-25T14:00:00Z",
    "duration": 45,
    "totalPrice": 70,
    "status": "confirmed",
    "confirmationCode": "AH-2025-11-17-001",
    "vendor": {
      "id": "vnd_456def",
      "businessName": "Elite Salon",
      "phone": "+1-555-0123",
      "location": "123 Main St, New York, NY"
    },
    "customer": {
      "id": "usr_xyz",
      "name": "Jane Smith",
      "phone": "+1-555-0456"
    },
    "notes": "Please arrive 5 minutes early",
    "createdAt": "2025-11-17T10:30:00Z",
    "confirmedAt": "2025-11-17T10:35:00Z"
  }
}
```

### List User Bookings

**Endpoint:** `GET /users/bookings`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
```
?status=confirmed&page=1&pageSize=20&sortBy=serviceDate&sortOrder=desc
```

**Response:** `200 OK`
```json
{
  "data": {
    "items": [
      {
        "id": "bkg_123abc",
        "serviceName": "Professional Haircut",
        "vendorName": "Elite Salon",
        "serviceDate": "2025-11-25T14:00:00Z",
        "totalPrice": 70,
        "status": "confirmed"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 5,
    "hasMore": false
  }
}
```

### Confirm Booking

**Endpoint:** `PUT /bookings/:bookingId/confirm`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "paymentId": "pay_123abc"
}
```

**Response:** `200 OK`
```json
{
  "data": {
    "id": "bkg_123abc",
    "status": "confirmed",
    "confirmedAt": "2025-11-17T10:35:00Z"
  },
  "message": "Booking confirmed successfully"
}
```

### Cancel Booking

**Endpoint:** `PUT /bookings/:bookingId/cancel`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "reason": "Schedule conflict",
  "refundReason": "customer_request"
}
```

**Response:** `200 OK`
```json
{
  "data": {
    "id": "bkg_123abc",
    "status": "cancelled",
    "cancelledAt": "2025-11-17T10:40:00Z",
    "refundStatus": "pending",
    "refundAmount": 70
  },
  "message": "Booking cancelled successfully"
}
```

### Reschedule Booking

**Endpoint:** `PUT /bookings/:bookingId/reschedule`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "newServiceDate": "2025-11-26",
  "newTimeSlotId": "ts_456",
  "reason": "Schedule conflict"
}
```

**Response:** `200 OK`
```json
{
  "data": {
    "id": "bkg_123abc",
    "serviceDate": "2025-11-26T14:00:00Z",
    "status": "confirmed",
    "rescheduledAt": "2025-11-17T10:40:00Z"
  },
  "message": "Booking rescheduled successfully"
}
```

---

## Orders API

### Create Order

**Endpoint:** `POST /orders`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "items": [
    {
      "productId": "prod_123abc",
      "quantity": 2,
      "selectedVariants": {
        "color": "black",
        "size": "large"
      }
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "addressLine1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pinCode": "10001",
    "country": "US",
    "phone": "+1-555-0123"
  },
  "shippingMethod": "standard",
  "couponCode": "SAVE10"
}
```

**Response:** `201 Created`
```json
{
  "data": {
    "id": "ord_123abc",
    "customerId": "usr_xyz",
    "items": [
      {
        "id": "oi_123",
        "productId": "prod_123abc",
        "productName": "MacBook Pro 14",
        "quantity": 2,
        "unitPrice": 1999.99,
        "itemTotal": 3999.98
      }
    ],
    "subtotal": 3999.98,
    "taxAmount": 320.00,
    "shippingCost": 10.00,
    "discountAmount": 400.00,
    "totalAmount": 3929.98,
    "status": "pending_payment",
    "estimatedDeliveryDate": "2025-11-25",
    "createdAt": "2025-11-17T10:30:00Z"
  },
  "message": "Order created successfully"
}
```

### Get Order Details

**Endpoint:** `GET /orders/:orderId`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`
```json
{
  "data": {
    "id": "ord_123abc",
    "customerId": "usr_xyz",
    "items": [
      {
        "id": "oi_123",
        "vendorId": "vnd_456def",
        "productId": "prod_123abc",
        "productName": "MacBook Pro 14",
        "quantity": 2,
        "unitPrice": 1999.99,
        "itemTotal": 3999.98,
        "status": "shipped",
        "trackingNumber": "TRK123456789"
      }
    ],
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "fullAddress": "123 Main St, New York, NY 10001, US"
    },
    "subtotal": 3999.98,
    "totalAmount": 3929.98,
    "status": "shipped",
    "timeline": [
      {
        "status": "pending_payment",
        "timestamp": "2025-11-17T10:30:00Z",
        "description": "Order placed"
      },
      {
        "status": "confirmed",
        "timestamp": "2025-11-17T10:35:00Z",
        "description": "Payment confirmed"
      },
      {
        "status": "processing",
        "timestamp": "2025-11-17T11:00:00Z",
        "description": "Order processing"
      },
      {
        "status": "shipped",
        "timestamp": "2025-11-20T08:00:00Z",
        "description": "Item shipped"
      }
    ]
  }
}
```

### List User Orders

**Endpoint:** `GET /users/orders`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
```
?status=delivered&page=1&pageSize=20&sortBy=createdAt&sortOrder=desc
```

**Response:** `200 OK` (Similar format to list products)

### Cancel Order

**Endpoint:** `PUT /orders/:orderId/cancel`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "reason": "Order placed by mistake",
  "refundReason": "customer_request"
}
```

**Response:** `200 OK`
```json
{
  "data": {
    "id": "ord_123abc",
    "status": "cancelled",
    "cancelledAt": "2025-11-17T10:45:00Z",
    "refundStatus": "pending",
    "refundAmount": 3929.98
  },
  "message": "Order cancelled successfully"
}
```

---

## Payments API

### Create Payment

**Endpoint:** `POST /payments`

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request:**
```json
{
  "orderId": "ord_123abc",
  "amount": 3929.98,
  "currency": "USD",
  "method": "credit_card",
  "paymentMethodId": "pm_123abc"
}
```

**Response:** `201 Created`
```json
{
  "data": {
    "id": "pay_123abc",
    "orderId": "ord_123abc",
    "amount": 3929.98,
    "currency": "USD",
    "method": "credit_card",
    "status": "processing",
    "transactionId": "txn_123abc",
    "createdAt": "2025-11-17T10:30:00Z"
  },
  "message": "Payment initiated"
}
```

### Confirm Payment

**Endpoint:** `POST /payments/:paymentId/confirm`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "paymentToken": "token_from_payment_gateway",
  "cardDetails": {
    "cardNumberToken": "tok_visa"
  }
}
```

**Response:** `200 OK`
```json
{
  "data": {
    "id": "pay_123abc",
    "status": "successful",
    "transactionId": "txn_stripe_123",
    "gatewayReference": "ch_stripe_123",
    "confirmedAt": "2025-11-17T10:32:00Z"
  },
  "message": "Payment successful"
}
```

### Get Payment Details

**Endpoint:** `GET /payments/:paymentId`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`
```json
{
  "data": {
    "id": "pay_123abc",
    "orderId": "ord_123abc",
    "amount": 3929.98,
    "currency": "USD",
    "method": "credit_card",
    "status": "successful",
    "transactionId": "txn_stripe_123",
    "gatewayReference": "ch_stripe_123",
    "createdAt": "2025-11-17T10:30:00Z",
    "confirmedAt": "2025-11-17T10:32:00Z"
  }
}
```

### List Payment Methods

**Endpoint:** `GET /users/payment-methods`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "pm_123abc",
      "type": "credit_card",
      "lastFour": "4242",
      "brand": "visa",
      "expiryMonth": 12,
      "expiryYear": 2026,
      "isDefault": true,
      "createdAt": "2025-11-10T00:00:00Z"
    }
  ]
}
```

### Add Payment Method

**Endpoint:** `POST /users/payment-methods`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "type": "credit_card",
  "paymentToken": "tok_visa",
  "isDefault": false
}
```

**Response:** `201 Created`
```json
{
  "data": {
    "id": "pm_456def",
    "type": "credit_card",
    "lastFour": "4242",
    "brand": "visa",
    "expiryMonth": 12,
    "expiryYear": 2026
  },
  "message": "Payment method added successfully"
}
```

### Delete Payment Method

**Endpoint:** `DELETE /users/payment-methods/:paymentMethodId`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`
```json
{
  "message": "Payment method deleted successfully"
}
```

---

## Reviews API

### Create Product Review

**Endpoint:** `POST /products/:productId/reviews`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "rating": 5,
  "comment": "Excellent product, fast shipping",
  "imageUrls": ["https://..."],
  "orderId": "ord_123abc"
}
```

**Response:** `201 Created`
```json
{
  "data": {
    "id": "rev_123abc",
    "productId": "prod_123abc",
    "customerId": "usr_xyz",
    "customerName": "Jane Smith",
    "rating": 5,
    "comment": "Excellent product, fast shipping",
    "imageUrls": ["https://..."],
    "helpfulCount": 0,
    "createdAt": "2025-11-17T10:30:00Z"
  },
  "message": "Review created successfully"
}
```

### Create Service Review

**Endpoint:** `POST /services/:serviceId/reviews`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "rating": 5,
  "comment": "Great service, very professional",
  "bookingId": "bkg_123abc"
}
```

**Response:** `201 Created`
```json
{
  "data": {
    "id": "rev_456def",
    "serviceId": "svc_123abc",
    "customerId": "usr_xyz",
    "rating": 5,
    "comment": "Great service, very professional",
    "serviceDate": "2025-11-25T14:00:00Z",
    "createdAt": "2025-11-17T10:30:00Z"
  },
  "message": "Review created successfully"
}
```

### Update Review

**Endpoint:** `PUT /reviews/:reviewId`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "rating": 4,
  "comment": "Good product, but delivery was late"
}
```

**Response:** `200 OK`
```json
{
  "data": {
    "id": "rev_123abc",
    "rating": 4,
    "comment": "Good product, but delivery was late",
    "updatedAt": "2025-11-17T10:45:00Z"
  },
  "message": "Review updated successfully"
}
```

### Delete Review

**Endpoint:** `DELETE /reviews/:reviewId`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`
```json
{
  "message": "Review deleted successfully"
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  },
  "statusCode": 400
}
```

### Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| INVALID_CREDENTIALS | 401 | Invalid email or password |
| TOKEN_EXPIRED | 401 | JWT token has expired |
| UNAUTHORIZED | 403 | User not authorized for action |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Input validation failed |
| CONFLICT | 409 | Resource already exists |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |
| SERVICE_UNAVAILABLE | 503 | Service temporarily unavailable |

---

## Rate Limiting

### Limits

- **Anonymous users:** 100 requests per minute
- **Authenticated users:** 1000 requests per minute
- **Admin users:** 5000 requests per minute

### Rate Limit Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1637069400
```

---

## Webhook Events

### Booking Confirmed

**Event:** `booking.confirmed`

**Payload:**
```json
{
  "event": "booking.confirmed",
  "timestamp": "2025-11-17T10:35:00Z",
  "data": {
    "bookingId": "bkg_123abc",
    "customerId": "usr_xyz",
    "vendorId": "vnd_456def",
    "serviceDate": "2025-11-25T14:00:00Z",
    "confirmationCode": "AH-2025-11-17-001"
  }
}
```

### Order Shipped

**Event:** `order.shipped`

**Payload:**
```json
{
  "event": "order.shipped",
  "timestamp": "2025-11-20T08:00:00Z",
  "data": {
    "orderId": "ord_123abc",
    "customerId": "usr_xyz",
    "trackingNumber": "TRK123456789",
    "estimatedDeliveryDate": "2025-11-25"
  }
}
```

### Payment Completed

**Event:** `payment.completed`

**Payload:**
```json
{
  "event": "payment.completed",
  "timestamp": "2025-11-17T10:32:00Z",
  "data": {
    "paymentId": "pay_123abc",
    "orderId": "ord_123abc",
    "amount": 3929.98,
    "transactionId": "txn_stripe_123"
  }
}
```

---

## Pagination

All list endpoints support pagination with the following parameters:

- `page` (default: 1) - Page number
- `pageSize` (default: 20, max: 100) - Items per page

Response includes:
```json
{
  "data": {
    "items": [...],
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "hasMore": true
  }
}
```

---

## Sorting

Supported `sortBy` values vary by endpoint. Common ones:
- `createdAt` - Creation date
- `rating` - User rating
- `price` - Product/service price
- `popularity` - Number of bookings/purchases

`sortOrder`: `asc` or `desc` (default: `asc`)

---

## Conclusion

This API specification provides a comprehensive guide for integrating ArtisanHub with the Flutter frontend. All endpoints follow REST conventions and include proper error handling, authentication, and pagination support.

For real-time features like chat and notifications, consider implementing WebSocket connections alongside this REST API.

