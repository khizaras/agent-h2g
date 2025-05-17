# Hands2gether

A community-driven platform to facilitate feeding people in need.

## Project Overview

Hands2gether is a web and mobile application designed to connect people who want to help with those in need of food assistance. The platform enables users to create, view, and contribute to various feeding initiatives.

## Features

- User authentication and profile management
- Create and browse causes for food assistance
- Search and filter causes by location or category
- Donate to causes and track contributions
- Rate and provide feedback on causes
- Admin dashboard for moderation and analytics

## Tech Stack

- **Frontend:** React.js, Ant Design, Redux Toolkit
- **Backend:** Node.js, Express.js, MySQL
- **Authentication:** JWT, Google OAuth
- **File Upload:** Multer
- **Email Notifications:** Nodemailer

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL database

### Installation

1. Clone the repository

   ```
   git clone https://github.com/yourusername/hands2gether.git
   cd hands2gether
   ```

2. Install dependencies (this installs all packages for both frontend and backend)

   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the necessary environment variables (see `.env.example`)

4. Set up the database

   ```
   mysql -u username -p
   CREATE DATABASE hands2gether_db;
   ```

5. Optional: Seed the database with initial test data

   ```
   npm run seed
   ```

   This will populate the database with test users, causes, contributions, and other data.

6. Run the development server
   ```
   npm run dev
   ```

This will start both the backend server and the frontend development server concurrently.

### Project Structure

The project is set up as a monorepo with shared node_modules between the frontend and backend. This approach:

- Reduces disk space usage
- Simplifies dependency management
- Ensures consistent versions across the project

Dependencies for both frontend and backend are managed in the root `package.json` file.

## Project Structure

```
hands2gether/
├── backend/               # Backend server code
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
├── frontend/              # Frontend React application
│   ├── public/            # Static files
│   └── src/               # React source code
│       ├── assets/        # Images, fonts, etc.
│       ├── components/    # Reusable components
│       ├── pages/         # Page components
│       ├── redux/         # Redux state management
│       ├── services/      # API services
│       └── utils/         # Utility functions
├── .env                   # Environment variables
└── package.json           # Project dependencies
```

## Testing

Run tests with:

```
npm test
```

## Testing the Application

After seeding the database, you can use the following test accounts to log in:

- **Admin User**

  - Email: admin@hands2gether.com
  - Password: password123
  - Role: Administrator

- **Regular User 1**

  - Email: john@example.com
  - Password: password123
  - Role: Regular user (has created causes)

- **Regular User 2**
  - Email: jane@example.com
  - Password: password123
  - Role: Regular user (has contributed to causes)

These accounts have pre-populated data including causes, contributions, and feedbacks to showcase the application's features.

## Deployment

For production deployment:

```
npm run build
npm start
```

## License

[MIT](LICENSE)
