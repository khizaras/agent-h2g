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
- AI-powered chatbot assistant to answer questions about causes and the platform

## Tech Stack

- **Frontend:** React.js, Ant Design, Redux Toolkit
- **Backend:** Node.js, Express.js, MySQL
- **Authentication:** JWT, Google OAuth
- **File Upload:** Multer, ImageKit (cloud storage)
- **Email Notifications:** Nodemailer
- **AI Assistant:** OpenRouter.ai with MistralAI integration

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

   Required environment variables:

   ```
   # Database
   DB_HOST=localhost
   DB_USER=username
   DB_PASSWORD=password
   DB_NAME=hands2gether_db

   # JWT Secret
   JWT_SECRET=your_secret_key

   # Email Service
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # ImageKit (for cloud image storage)
   IMAGEKIT_PUBLIC_KEY=your_public_key
   IMAGEKIT_PRIVATE_KEY=your_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_account
   ```

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

## Cloud Storage

Hands2gether uses ImageKit for cloud storage of images. This provides:

- Improved performance with optimized image delivery
- Automatic image transformations (resizing, cropping, etc.)
- CDN delivery for faster global access
- Reduced server storage requirements
- Better scalability

See the [ImageKit Integration Documentation](./docs/imagekit-integration.md) for more details.

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
