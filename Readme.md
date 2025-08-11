# ShoppyGlobe API (Node.js + Express + MongoDB)

## Overview 

### ShoppyGlobe API provides backend services for an e-commerce app:

   * Products: list and detail
   * Authentication: user registration and login with JWT
   * Cart: add, update, and remove items (JWT-protected)
   * Robust validation and centralized error handling

### Tech Stack :

   * Node.js, Express.js
   * MongoDB, Mongoose
   * JWT (jsonwebtoken), bcryptjs
   * CORS, dotenv
   * Thunder Client (for API testing)

### Folder Structure :
   
```plane

     shoppyglobe-api/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── cartController.js
│   └── productController.js
├── middleware/
│   ├── auth.js            # JWT auth middleware
│   └── errorHandler.js
├── models/
│   ├── Cart.js
│   ├── Product.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── cart.js
│   └── products.js
├── app.js                 # Main app config
├── .env                   # DB URI, JWT secret
├── package.json
└── README.md

```

## Getting Started
 
### Prerequisites

   * Node.js (v16+ recommended)
   * MongoDB (local or Atlas)
   * VS Code Thunder Client (for testing) 

### Installation

   ```bash
    git clone [https://github.com/alankritip/-ShoppyGlobeBackend-]
    cd shoppyglobe-api
    npm install
   ```

## Environment variables:

### Create a .env file at project root:
  
   * MONGODB_URI=mongodb://localhost:27017/shoppyglobe
   * JWT_SECRET=YourVerySecretKey
   * PORT=3000

### Start the server:
   
   * npm run dev (if using nodemon) or npm start
   * You should see “MongoDB connected” and “Server listening on port 3000”

## API Endpoints

### Base URL
[http://localhost:3000] (or the PORT you set)

### Public Endpoints

   #### GET /products
    * Returns an array of products.
    * 200 OK

   #### GET /products/:id
    * Returns a single product by MongoDB ObjectId.
    * 200 OK    
    * 400 Invalid productId format
    * 404 Product not found

## Authentication

   #### POST /register
    * Body: { "username": "string", "password": "string" }
    * 201 User registered
    * 400 Missing fields
    * 409 Username already exists

   #### POST /login
    * Body: { "username": "string", "password": "string" }
    * 200 { "token": "JWT_TOKEN" }
    * 401 Invalid credentials

 ### Protected Endpoints (require Bearer token)

   * Attach Authorization: Bearer <JWT_TOKEN> to all /cart requests.

    #### POST /cart
     * Body: { "productId": "<ObjectId>", "quantity": number }
     * 200 Updated cart object
     * 400 Missing/invalid body (e.g., quantity < 1) or invalid productId format
     * 401 Unauthorized (missing/invalid token)
     * 404 Product not found
     
    #### PUT /cart/:productId
     * Body: { "quantity": number }
     * 200 Updated cart object
     * 400 quantity must be >= 1 or invalid productId format
     * 401 Unauthorized
     * 404 Product not in cart
     
    #### DELETE /cart/:productId
     * 200 Updated cart without that item
     * 400 Invalid productId format
     * 401 Unauthorized

## Validation & Error Handling

   ### Centralized error handler returns JSON with message and appropriate HTTP status.

   #### Common responses:
   * 400 Invalid productId format or bad request data
   * 401 Authorization token required / Invalid or expired token
   * 404 Product not found / Product not in cart
   * 500 Server error (unexpected)

   ### Testing with Thunder Client (VS Code)

   #### Create a Thunder Client collection and add:
     * GET /products
     * GET /products/:id
     * POST /register
     * POST /login
     * POST /cart (with Bearer token)
     * PUT /cart/:productId (with Bearer token)
     * DELETE /cart/:productId (with Bearer token)

   ### Save token from /login and set it in Auth tab as Bearer Token or as an environment variable {{token}}.

   ### Capture screenshots of:
     * Successful product, auth, and cart requests
     * Error cases (invalid token, invalid productId, 404 not found)
     * Include screenshots in tests/screenshots/ and reference them here.

## Troubleshooting

  ### Invalid or expired token: 
   * Re-login to get fresh token. 
   * Ensure Authorization header format: Bearer <token>.
   * Verify JWT_SECRET is same for sign and verify.

  ### jwt malformed:
   * Ensure only the raw token (three dot-separated parts) is passed; no quotes or “Bearer ” prefix in verify.

  ### 404 Product not found:
   * Use a valid ObjectId from existing products (GET /products).
   
  ### Cannot connect to DB:
   * Check MONGODB_URI, ensure MongoDB is running, and network access is allowed.

## License
  (MIT License) [https://choosealicense.com/licenses/mit/]