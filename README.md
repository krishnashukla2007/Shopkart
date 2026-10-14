# ShopKart — Full-Stack E-Commerce Application

ShopKart is a full-stack e-commerce application built with React, Node.js, Express, and MongoDB. It supports customer authentication, product browsing, wishlists, shopping carts, checkout, and order management, with Razorpay test-mode payment integration.

**🚀 Live Demo:** [ShopKart](https://shopkart-flax-six.vercel.app/)

**💻 GitHub Repository:** [ShopKart Source Code](https://github.com/krishnashukla2007/Shopkart)

> **Note:** The live application depends on the availability of the deployed backend and database. Razorpay payments are configured for test mode only.

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

### Deployment and Database

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

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

Install the following before running the project locally:

* Node.js and npm
* MongoDB, either locally or through MongoDB Atlas
* A Razorpay account with test-mode API credentials

## Installation and Setup

### 1. Clone the Repository

Clone the repository and navigate to the project directory.

```bash
git clone https://github.com/krishnashukla2007/Shopkart.git
cd Shopkart
```

### 2. Configure the Backend

Navigate to the backend directory and install the dependencies.

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

**Security:** Never commit your actual `.env` file or expose API secrets in the repository. Keep backend credentials on the server and use environment variables to configure them.

### 3. Start the Backend

From the `backend` directory, run:

```bash
node server.js
```

The backend runs at:

```text
http://localhost:5000
```

The server connects to MongoDB and exposes routes for customers, products, wishlists, carts, and orders.

Keep this terminal running.

### 4. Configure and Start the Frontend

Open a second terminal in the project root and navigate to the frontend directory.

```bash
cd frontend
npm install
npm run dev
```

Vite starts the frontend, normally at:

```text
http://localhost:5173
```

Open that address in your browser.

For local development, ensure the frontend API client points to your local backend and that the backend CORS configuration allows credentialed requests from the local frontend origin.

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

## Deployment

ShopKart is deployed using the following architecture:

| Component | Platform      | Purpose                          |
| --------- | ------------- | -------------------------------- |
| Frontend  | Vercel        | Hosts the React application      |
| Backend   | Render        | Runs the Node.js and Express API |
| Database  | MongoDB Atlas | Stores application data          |

### Live Application

Access the deployed application here:

**[Open ShopKart](https://shopkart-flax-six.vercel.app/)**

### Production Configuration

The deployed application requires the following configuration.

**Frontend — Vercel**

Configure the following environment variable:

```env
VITE_API_URL=your_deployed_backend_url
```

Replace the placeholder with your actual Render backend URL.

Because Vite exposes variables prefixed with `VITE_` to browser-side code, this variable should contain only the public backend URL, not secrets.

After changing environment variables, redeploy the frontend so the changes take effect.

**Backend — Render**

Configure the environment variables required by the backend:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Ensure that:

* The MongoDB Atlas cluster is available and accessible to the deployed backend.
* The database credentials are valid.
* The backend uses the correct port configuration for Render.
* CORS allows requests from the deployed Vercel frontend.
* Cookie settings support the deployed frontend and backend origins.
* Razorpay test-mode credentials are configured correctly.

**Database — MongoDB Atlas**

The backend uses MongoDB Atlas to store application data. Configure network access and database authentication appropriately for the deployed backend.

Avoid exposing database credentials or unnecessarily allowing unrestricted network access.

## Security Considerations

* Passwords are hashed using bcrypt.
* Authentication uses JWTs and cookies.
* Backend validation is used to validate incoming data.
* Checkout data is validated and order totals are calculated server-side.
* Payment verification is performed on the backend.
* Order access is restricted to the relevant customer.
* Environment files containing secrets must not be committed to GitHub.
* Sensitive credentials must be stored in backend environment variables rather than frontend code.
* Production CORS and cookie settings must be configured appropriately for cross-origin requests.

## Development Commands

### Backend

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
node server.js
```

### Frontend

Install dependencies:

```bash
npm install
```

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

* MongoDB must be accessible, and the connection string must be valid.
* The backend requires the environment variables listed above.
* Razorpay payment processing requires valid test-mode credentials.
* The frontend API URL must point to the appropriate backend for the environment.
* The backend CORS configuration must allow requests from the correct frontend origin.
* Authentication cookies must be configured appropriately for local development and production deployment.
* The live application depends on the availability of Vercel, Render, and MongoDB Atlas.
* Render services may take longer to respond after a period of inactivity, depending on the hosting plan.
* The backend currently has no configured automated test suite.

## License

This project was developed as part of an educational full-stack engineering lab.
