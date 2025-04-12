# Store Rating Application

A full-stack web application that allows users to rate and review stores, with separate interfaces for users, store owners, and administrators.

## Features

- **User Authentication & Authorization**

  - User registration and login
  - Role-based access (Admin, Store Owner, Regular User)
  - Protected routes and API endpoints

- **User Features**

  - View all stores with ratings
  - Search stores by name and address
  - Rate stores (1-5 stars)
  - View store details and ratings

- **Store Owner Features**

  - View their own stores
  - See ratings and reviews for their stores
  - Access store analytics

- **Admin Features**
  - Dashboard with statistics
  - Manage users and stores
  - View all ratings
  - Add new users and stores

## Tech Stack

### Frontend

- React 19
- React Router v7
- TailwindCSS
- Axios
- Chart.js
- React Icons

### Backend

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- PNPM (recommended) or NPM

### Environment Setup

1. Backend (.env):

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=roxiler
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secret_key
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/roxiler
```

2. Frontend (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <project-folder>
```

2. Backend Setup:

```bash
cd backend
pnpm install
npx sequelize-cli db:migrate
pnpm run dev
```

3. Frontend Setup:

```bash
cd frontend
pnpm install
pnpm run dev
```

## Project Structure

### Frontend

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── context/       # Context providers
│   ├── pages/         # Page components
│   ├── utils/         # Utility functions
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
└── ...config files
```

### Backend

```
backend/
├── config/           # Database configuration
├── middleware/       # Custom middleware
├── models/          # Sequelize models
├── routes/          # API routes
├── migrations/      # Database migrations
└── server.js        # Entry point
```

## API Endpoints

### Authentication

- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - User login

### Users

- GET `/api/users` - Get all users (admin only)
- GET `/api/users/:id` - Get user details
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Stores

- GET `/api/stores` - Get all stores
- GET `/api/stores/:id` - Get store details
- POST `/api/stores` - Create new store
- PUT `/api/stores/:id` - Update store
- DELETE `/api/stores/:id` - Delete store

### Ratings

- POST `/api/ratings` - Submit rating
- GET `/api/ratings/store/:id` - Get store ratings

## Data Models

### User

```javascript
{
  id: UUID,
  name: String,
  email: String,
  password: String,
  address: String,
  role: Enum['user', 'admin', 'store_owner']
}
```

### Store

```javascript
{
  id: UUID,
  name: String,
  email: String,
  address: String,
  ownerId: UUID
}
```

### Rating

```javascript
{
  id: UUID,
  value: Number(1-5),
  userId: UUID,
  storeId: UUID
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
