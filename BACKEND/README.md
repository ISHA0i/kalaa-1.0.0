# Kalaa Art Gallery Backend

Backend API for the Kalaa Art Gallery e-commerce platform, which sells art pieces and connects artists with buyers.

## Features

- User authentication with JWT
- User roles (buyer, artist, admin)
- Product management
- Cart functionality
- Order processing
- Artist profiles
- Favorites and ratings

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Product Routes
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (artist/admin)
- `PUT /api/products/:id` - Update product (artist/admin)
- `DELETE /api/products/:id` - Delete product (artist/admin)
- `POST /api/products/:id/ratings` - Add rating to product

### User Routes
- `GET /api/users/artists` - Get all artists
- `GET /api/users/artists/:id` - Get artist with their products
- `GET /api/users/favorites` - Get user favorites
- `POST /api/users/favorites/:productId` - Add product to favorites
- `DELETE /api/users/favorites/:productId` - Remove product from favorites
- `GET /api/users` - Get all users (admin)
- `POST /api/users` - Create new user (admin)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)

### Order Routes
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/artist-orders` - Get artist's orders (artist)
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id` - Update order status (admin/artist)

### Cart Routes
- `GET /api/cart` - Get user's cart
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:productId` - Update cart item quantity
- `DELETE /api/cart/items/:productId` - Remove item from cart

## Setup

### Environment Variables
Create a `.env` file based on the `.env.example` template.

### Installation
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Tech Stack
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for email functionality 