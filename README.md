# ShopKart — Full-Stack E-Commerce Application

ShopKart is a full-stack e-commerce application built with React, Node.js, Express, and MongoDB. It supports customer authentication, product browsing, wishlists, shopping carts, checkout, and order management, with Razorpay test-mode payment integration.

## Features

* Customer registration and login
* Cookie-based authentication using JWT
* Product listing and product details
* Wishlist management
* Shopping cart management
* Checkout with shipping information
* Razorpay test-mode payment integration
* Payment verification on the backend
* Order creation and order history
* Individual order details
* Backend validation and customer-specific order access

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JSON Web Tokens (JWT)
* bcrypt
* Cookie Parser
* Razorpay

## Project Structure

```text
shop-kart/
├── backend/
│   ├── config/
│   │   └── razorpay.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

* Node.js and npm
* MongoDB, either locally or through MongoDB Atlas
* A Razorpay account with test-mode API credentials

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd shop-kart
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the repository URL.

### 2. Configure the Backend

Open a terminal in the project root and run:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory.

Add the following environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Replace the placeholder values with your own credentials.

* `MONGO_URI`: MongoDB connection string.
* `JWT_SECRET`: A strong, private secret used for signing JWTs.
* `RAZORPAY_KEY_ID`: Your Razorpay test-mode key ID.
* `RAZORPAY_KEY_SECRET`: Your Razorpay test-mode key secret.

Never commit your actual `.env` file or expose API secrets in the repository.

### 3. Start the Backend

From the `backend` directory, run:

```bash
node server.js
```

The backend runs at:

`http://localhost:5000`

The server connects to MongoDB and exposes routes for customers, products, wishlists, carts, and orders.

Keep this terminal running.

### 4. Configure and Start the Frontend

Open a second terminal in the project root and run:

```bash
cd frontend
npm install
npm run dev
```

Vite starts the frontend, normally at:

`http://localhost:5173`

Open that address in your browser.

The frontend API client connects to the backend at `http://localhost:5000`. The backend also allows credentialed requests from `http://localhost:5173`, so both applications should run at these addresses with the current configuration.

## Application Workflow

1. Register a customer account.
2. Log in to access the application.
3. Browse products and open product details.
4. Add products to the wishlist or shopping cart.
5. Update the cart as needed.
6. Proceed to checkout and enter the required shipping information.
7. Complete a payment using Razorpay test mode.
8. View the resulting order in My Orders.
9. Open an individual order to view its details.

Use Razorpay's test-mode credentials and supported test-payment details when testing checkout. Test transactions do not represent real payments.

## Security Considerations

* Passwords are hashed using bcrypt.
* Authentication uses JWTs and cookies.
* The backend validates checkout data and calculates order totals server-side.
* Payment verification is performed on the backend.
* Order access is restricted to the relevant customer.
* Environment files containing secrets must not be committed to GitHub.

## Development Commands

### Backend

Start the backend:

```bash
node server.js
```

Install backend dependencies:

```bash
npm install
```

### Frontend

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

## Important Notes

* MongoDB must be accessible and the connection string must be valid.
* The backend requires the environment variables listed above.
* Razorpay payment processing requires valid test-mode credentials.
* The current frontend API URL and backend CORS configuration use localhost addresses. These must be updated if the application is deployed to different domains.
* The backend currently has no configured automated test suite.

## License

This project was developed as part of an educational full-stack engineering lab.
