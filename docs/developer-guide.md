# Hands2gether - Developer Guide

## Introduction

Welcome to the Hands2gether developer documentation. This guide is designed to help developers understand the project structure, setup their development environment, and contribute to the Hands2gether platform. The platform is a community-driven food assistance application that connects those in need with generous contributors.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Configuration](#configuration)
4. [Project Structure](#project-structure)
5. [Development Workflow](#development-workflow)
   - [Branching Strategy](#branching-strategy)
   - [Commit Guidelines](#commit-guidelines)
   - [Pull Request Process](#pull-request-process)
6. [Testing](#testing)
   - [Unit Testing](#unit-testing)
   - [Integration Testing](#integration-testing)
   - [End-to-End Testing](#end-to-end-testing)
7. [Code Style and Standards](#code-style-and-standards)
8. [API Documentation](#api-documentation)
9. [Common Development Tasks](#common-development-tasks)
10. [Deployment](#deployment)
11. [Contributing](#contributing)
12. [Troubleshooting](#troubleshooting)

## Project Overview

Hands2gether is a full-stack application designed to facilitate food assistance in communities. The platform allows users to:

- Create and browse causes for food assistance
- Contribute to existing causes
- Provide feedback on causes and contributions
- Receive notifications about cause updates
- Track contribution status

The application consists of a React frontend and a Node.js/Express backend with MongoDB as the database.

## Technology Stack

### Frontend

- **Framework**: React.js
- **State Management**: Redux
- **Routing**: React Router
- **API Communication**: Axios
- **UI Components**: Material-UI
- **CSS Preprocessor**: SASS/SCSS
- **Testing**: Jest, React Testing Library

### Backend

- **Server**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Joi
- **Testing**: Mocha, Chai

### DevOps

- **Version Control**: Git, GitHub
- **CI/CD**: GitHub Actions
- **Deployment**: Docker, Heroku
- **Code Quality**: ESLint, Prettier

## Getting Started

### Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- MongoDB (v4 or higher)
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/hands2gether.git
   cd hands2gether
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Create environment files:
   - Create a `.env` file in the backend directory using the `.env.example` as a template
   - Create a `.env` file in the frontend directory using the `.env.example` as a template

### Configuration

1. Configure the backend `.env` file with the following variables:

   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/hands2gether
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   EMAIL_SERVICE=smtp
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   EMAIL_FROM=noreply@hands2gether.com
   ```

2. Configure the frontend `.env` file with:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

## Project Structure

```
hands2gether/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── tests/          # Test files
│   ├── package.json    # Backend dependencies
│   └── server.js       # Entry point
├── frontend/
│   ├── public/         # Static files
│   ├── src/
│   │   ├── assets/     # Images, fonts, etc.
│   │   ├── components/ # Reusable components
│   │   ├── context/    # React context
│   │   ├── hooks/      # Custom hooks
│   │   ├── pages/      # Page components
│   │   ├── redux/      # Redux state management
│   │   ├── services/   # API service functions
│   │   ├── styles/     # Global styles
│   │   ├── utils/      # Utility functions
│   │   ├── App.js      # Root component
│   │   └── index.js    # Frontend entry point
│   ├── package.json    # Frontend dependencies
│   └── README.md       # Frontend documentation
├── docs/               # Documentation
├── .gitignore          # Git ignore rules
├── README.md           # Project documentation
└── package.json        # Root dependencies
```

## Development Workflow

### Branching Strategy

We follow a Gitflow-inspired branching strategy:

- `main`: Production-ready code
- `develop`: Latest development changes
- `feature/feature-name`: New features
- `bugfix/bug-name`: Bug fixes
- `hotfix/fix-name`: Urgent production fixes
- `release/version`: Release preparation

### Commit Guidelines

Follow these guidelines for commit messages:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable type:
  - `feat:` (new feature)
  - `fix:` (bug fix)
  - `docs:` (documentation changes)
  - `style:` (formatting, missing semi-colons, etc; no code change)
  - `refactor:` (refactoring code)
  - `test:` (adding tests, refactoring tests; no production code change)
  - `chore:` (updating build tasks, package manager configs, etc; no production code change)

### Pull Request Process

1. Ensure your code follows the style guides and passes all tests
2. Update the documentation if needed
3. Fill in the pull request template with all required information
4. Request a review from at least one team member
5. Address any feedback from reviewers
6. Once approved, the PR can be merged

## Testing

### Unit Testing

Unit tests for the backend are written using Mocha and Chai. For the frontend, we use Jest and React Testing Library.

To run backend tests:

```bash
cd backend
npm test
```

To run frontend tests:

```bash
cd frontend
npm test
```

### Integration Testing

Integration tests verify that different modules work together correctly. These tests are also written using Mocha and Chai for the backend and Jest for the frontend.

To run integration tests:

```bash
cd backend
npm run test:integration
```

### End-to-End Testing

End-to-end tests are written using Cypress and verify the application works correctly from a user's perspective.

To run E2E tests:

```bash
cd frontend
npm run test:e2e
```

## Code Style and Standards

We maintain code quality and consistency through the following standards:

### JavaScript/React

- We follow the Airbnb JavaScript Style Guide
- Use ES6+ features when possible
- Use functional components with hooks in React
- Keep components small and focused on a single responsibility
- Use PropTypes for component props validation

### CSS/SCSS

- Follow BEM (Block Element Modifier) naming convention
- Use SCSS for styling
- Maintain a consistent color palette and spacing system
- Use responsive design principles

### Backend

- Follow RESTful API design principles
- Use async/await for asynchronous operations
- Implement proper error handling
- Document API endpoints using JSDoc comments

## API Documentation

For detailed API documentation, refer to the [API Documentation](./api.md) file.

## Common Development Tasks

### Adding a New API Endpoint

1. Create a new controller function in the appropriate controller file
2. Add the route in the appropriate route file
3. Update the API documentation
4. Add tests for the new endpoint

### Creating a New React Component

1. Create a new component file in `frontend/src/components`
2. If the component needs to interact with the API, create or update the corresponding service
3. Add the component to the appropriate page or parent component
4. Write tests for the component

### Adding a New Model

1. Create a new model file in `backend/models`
2. Define the schema using Mongoose Schema
3. Create necessary controllers and routes
4. Add validation using Joi
5. Write tests for the model and its endpoints

## Deployment

### Development Environment

For local development:

```bash
# Start backend server
cd backend
npm run dev

# Start frontend development server
cd frontend
npm start
```

### Production Deployment

We use Docker for containerization and deploy to Heroku:

1. Build Docker images:

   ```bash
   docker build -t hands2gether-backend ./backend
   docker build -t hands2gether-frontend ./frontend
   ```

2. Deploy to Heroku:

   ```bash
   # Login to Heroku
   heroku login
   heroku container:login

   # Push and release the backend
   heroku container:push web -a hands2gether-backend
   heroku container:release web -a hands2gether-backend

   # Push and release the frontend
   heroku container:push web -a hands2gether-frontend
   heroku container:release web -a hands2gether-frontend
   ```

## Contributing

We welcome contributions from the community! Please read through this guide and the [CONTRIBUTING.md](../CONTRIBUTING.md) file before submitting pull requests.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

#### MongoDB Connection Issues

If you're having trouble connecting to MongoDB:

- Ensure MongoDB is running (`mongod` command)
- Check your connection string in the `.env` file
- Verify network settings if using a remote database

#### Frontend API Connection Issues

If the frontend can't connect to the backend:

- Ensure the backend server is running
- Check that the `REACT_APP_API_URL` in the frontend `.env` file is correct
- Verify there are no CORS issues

#### JWT Authentication Issues

If you're experiencing authentication problems:

- Check that your JWT_SECRET is properly set in the `.env` file
- Ensure tokens are being properly generated and stored
- Verify token expiration settings

For additional help, please open an issue on the GitHub repository or contact the development team.
