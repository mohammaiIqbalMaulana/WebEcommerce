# E-CommerceShop

A full-stack e-commerce web application built with modern technologies. Users can browse products, manage their shopping cart, place orders with Stripe payment processing, and enjoy a seamless shopping experience. Admins have access to a comprehensive dashboard for managing products, orders, and users.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Scripts](#scripts)

## Features

### User Features
- **Authentication & Authorization**
  - Firebase Authentication with Google sign-in
  - Role-based access control (User/Admin)
  - Secure user sessions

- **Product Management**
  - Browse products with pagination
  - Search products by name or description
  - Filter products by category
  - Sort products by price
  - Add/remove products to/from favorites
  - View detailed product information

- **Shopping Experience**
  - Add/remove products to/from cart
  - Persistent cart with Redux Persist
  - Secure checkout process
  - Stripe payment integration
  - Order history and tracking

- **User Profile**
  - View and update profile information
  - Upload profile avatars (Cloudinary integration)
  - Order management

### Admin Features
- **Dashboard Overview**
  - Statistics and analytics
  - Revenue tracking
  - Customer metrics

- **Product Management**
  - Create, read, update, delete products
  - Image upload and management
  - Category management
  - Stock quantity management

- **Order Management**
  - View all orders
  - Update order status
  - Customer order details

### Technical Features
- **Responsive Design**
  - Mobile-first approach
  - TailwindCSS for styling
  - Dark mode support

- **Progressive Web App (PWA)**
  - Offline capabilities
  - Installable on mobile devices
  - Service worker integration

- **Performance & UX**
  - Framer Motion animations
  - React Query for data fetching
  - Optimized images with Sharp
  - Loading states and error handling

- **Testing**
  - End-to-end testing with Cypress
  - Component testing support

## Technologies

### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=Tailwind-CSS&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

### Backend
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

### Services & Tools
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=Stripe&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=Cypress&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

### Additional Libraries
- **React Query** for server state management
- **React Hook Form** with Yup validation
- **React Router** for navigation
- **React Toastify** for notifications
- **Axios** for HTTP requests
- **Sharp** for image processing
- **Multer** for file uploads
- **UUID** for unique identifiers
- **Lodash** for utility functions

## Project Structure

```
.
├── frontend/                 # React TypeScript frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── app/            # API and store configuration
│   │   ├── assets/         # Images and styles
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React contexts
│   │   ├── features/       # Feature-based modules
│   │   │   ├── auth/       # Authentication
│   │   │   ├── cart/       # Shopping cart
│   │   │   ├── checkout/   # Payment processing
│   │   │   ├── orders/     # Order management
│   │   │   ├── products/   # Product catalog
│   │   │   └── users/      # User profiles
│   │   ├── routes/         # Application routing
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── cypress/            # E2E tests
│   └── package.json
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema and migrations
│   └── package.json
├── package.json            # Root package.json for monorepo
└── README.md
```

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18.16.0 or higher)
- **npm** or **yarn**
- **MySQL** database
- **Git**

You'll also need accounts for the following services:
- **Firebase** (for authentication)
- **Stripe** (for payments)
- **Cloudinary** (for image storage)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd web-e-commerce
   ```

2. **Install root dependencies:**
   ```bash
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/ecommerce_db"

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=your_client_cert_url

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Application
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Database Setup

1. **Create MySQL database:**
   ```sql
   CREATE DATABASE ecommerce_db;
   ```

2. **Run Prisma migrations:**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

3. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

4. **Sync roles (optional):**
   ```bash
   npm run sync-roles
   ```

## Running the Application

### Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

This will start:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:3000`

### Individual Services

**Frontend only:**
```bash
cd frontend
npm run dev
```

**Backend only:**
```bash
cd backend
npm run server
```

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
npm run build
npm run start
```

## Testing

### End-to-End Testing

```bash
cd frontend
npx cypress open
```

Or run in headless mode:
```bash
npx cypress run
```

## Deployment

### Backend (Fly.io)

1. **Install Fly CLI**
2. **Login to Fly:**
   ```bash
   fly auth login
   ```
3. **Deploy:**
   ```bash
   cd backend
   fly deploy
   ```

### Frontend (Vercel/Netlify/Render)

1. **Build the project:**
   ```bash
   cd frontend
   npm run build
   ```
2. **Deploy the `dist` folder** to your hosting platform

### Docker

**Backend:**
```bash
cd backend
docker build -t ecommerce-backend .
docker run -p 3000:3000 ecommerce-backend
```

## Scripts

### Root Scripts
- `npm run dev` - Run both frontend and backend in development mode

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Scripts
- `npm run server` - Start development server with nodemon
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run sync-roles` - Sync user roles

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### Products
- `GET /products` - Get all products
- `POST /products` - Create product (Admin)
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)

### Categories
- `GET /category` - Get all categories
- `POST /category` - Create category (Admin)

### Orders
- `GET /orders` - Get user orders
- `POST /orders` - Create order

### Checkout
- `POST /checkout/create-session` - Create Stripe checkout session

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with modern React and TypeScript
- Styled with TailwindCSS
- Database managed with Prisma ORM
- Payments powered by Stripe
- Images hosted on Cloudinary
- Authentication via Firebase
