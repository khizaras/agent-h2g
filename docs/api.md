# Hands2gether API Documentation

This document outlines the endpoints available in the Hands2gether API.

## Base URL

All API endpoints are relative to the base URL:

Development: `http://localhost:5000/api`
Production: Depends on your deployment environment

## Authentication

Most endpoints require authentication. To authenticate requests, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

### Getting a Token

To obtain a token, use the login or registration endpoints.

## Endpoints

### Authentication

#### Register User

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response**:
  - **Code**: 201 CREATED
  - **Content**:
    ```json
    {
      "success": true,
      "user": {
        "id": 1,
        "name": "User Name",
        "email": "user@example.com",
        "token": "jwt-token-here"
      }
    }
    ```

#### Login User

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "user": {
        "id": 1,
        "name": "User Name",
        "email": "user@example.com",
        "token": "jwt-token-here"
      }
    }
    ```

#### Google Authentication

- **URL**: `/auth/google`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "token": "google-oauth-token"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "user": {
        "id": 1,
        "name": "User Name",
        "email": "user@example.com",
        "token": "jwt-token-here"
      }
    }
    ```

#### Get Current User

- **URL**: `/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "user": {
        "id": 1,
        "name": "User Name",
        "email": "user@example.com",
        "avatar": "path/to/avatar.jpg",
        "bio": "User bio"
      }
    }
    ```

#### Update Password

- **URL**: `/auth/password`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "currentPassword": "current-password",
    "newPassword": "new-password"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Password updated successfully"
    }
    ```

### Causes

#### Get All Causes

- **URL**: `/causes`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `category`: Filter by category (local, emergency, recurring)
  - `location`: Filter by location
  - `status`: Filter by status (active, pending, completed, suspended)
  - `search`: Search in title and description
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "causes": [
        {
          "id": 1,
          "title": "Cause Title",
          "description": "Cause description",
          "image": "/uploads/image.jpg",
          "location": "Location",
          "category": "emergency",
          "funding_goal": 5000,
          "current_funding": 2500,
          "food_goal": 100,
          "current_food": 50,
          "status": "active",
          "creator_name": "Creator Name",
          "creator_avatar": "/uploads/avatar.jpg",
          "contribution_count": 5,
          "created_at": "2023-01-01T00:00:00.000Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalPages": 3,
        "totalResults": 25
      }
    }
    ```

#### Get Cause by ID

- **URL**: `/causes/:id`
- **Method**: `GET`
- **Auth Required**: No (additional info if authenticated)
- **URL Parameters**:
  - `id`: Cause ID
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "cause": {
        "id": 1,
        "title": "Cause Title",
        "description": "Cause description",
        "image": "/uploads/image.jpg",
        "location": "Location",
        "category": "emergency",
        "funding_goal": 5000,
        "current_funding": 2500,
        "food_goal": 100,
        "current_food": 50,
        "status": "active",
        "creator_name": "Creator Name",
        "creator_avatar": "/uploads/avatar.jpg",
        "user_id": 2,
        "is_followed": false,
        "created_at": "2023-01-01T00:00:00.000Z"
      }
    }
    ```

#### Create Cause

- **URL**: `/causes`
- **Method**: `POST`
- **Auth Required**: Yes
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `title`: Cause title (required)
  - `description`: Cause description (required)
  - `image`: Image file
  - `location`: Cause location (required)
  - `category`: Cause category (required: local, emergency, recurring)
  - `funding_goal`: Funding goal amount
  - `food_goal`: Food goal amount
- **Success Response**:
  - **Code**: 201 CREATED
  - **Content**:
    ```json
    {
      "success": true,
      "cause": {
        "id": 1,
        "title": "Cause Title",
        "description": "Cause description",
        "image": "/uploads/image.jpg",
        "location": "Location",
        "category": "emergency",
        "funding_goal": 5000,
        "food_goal": 100,
        "user_id": 2
      }
    }
    ```

#### Update Cause

- **URL**: `/causes/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (owner or admin)
- **Content-Type**: `multipart/form-data`
- **URL Parameters**:
  - `id`: Cause ID
- **Request Body**:
  - `title`: Cause title
  - `description`: Cause description
  - `image`: Image file
  - `location`: Cause location
  - `category`: Cause category (local, emergency, recurring)
  - `funding_goal`: Funding goal amount
  - `food_goal`: Food goal amount
  - `status`: Cause status (active, pending, completed, suspended)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "cause": {
        "id": 1,
        "title": "Updated Title",
        "description": "Updated description",
        "image": "/uploads/image.jpg",
        "location": "Updated Location",
        "category": "emergency",
        "funding_goal": 7000,
        "food_goal": 150,
        "status": "active"
      }
    }
    ```

#### Delete Cause

- **URL**: `/causes/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (owner or admin)
- **URL Parameters**:
  - `id`: Cause ID
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Cause deleted successfully"
    }
    ```

#### Get Cause Contributions

- **URL**: `/causes/:id/contributions`
- **Method**: `GET`
- **Auth Required**: No
- **URL Parameters**:
  - `id`: Cause ID
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "contributions": [
        {
          "id": 1,
          "amount": 100,
          "food_quantity": 5,
          "message": "Contribution message",
          "anonymous": false,
          "user_id": 3,
          "user_name": "Contributor Name",
          "user_avatar": "/uploads/avatar.jpg",
          "created_at": "2023-01-01T00:00:00.000Z"
        }
      ]
    }
    ```

#### Get Cause Feedback

- **URL**: `/causes/:id/feedback`
- **Method**: `GET`
- **Auth Required**: No
- **URL Parameters**:
  - `id`: Cause ID
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "feedback": [
        {
          "id": 1,
          "rating": 5,
          "comment": "Feedback comment",
          "user_id": 3,
          "user_name": "Reviewer Name",
          "user_avatar": "/uploads/avatar.jpg",
          "created_at": "2023-01-01T00:00:00.000Z"
        }
      ]
    }
    ```

#### Add Contribution

- **URL**: `/causes/:id/contribute`
- **Method**: `POST`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Cause ID
- **Request Body**:
  - `amount`: Contribution amount (at least one of amount or food_quantity required)
  - `food_quantity`: Food quantity (at least one of amount or food_quantity required)
  - `message`: Contribution message (optional)
  - `anonymous`: Whether contribution is anonymous (default: false)
- **Success Response**:
  - **Code**: 201 CREATED
  - **Content**:
    ```json
    {
      "success": true,
      "contribution": {
        "id": 1,
        "amount": 100,
        "food_quantity": 5,
        "message": "Contribution message",
        "anonymous": false,
        "cause_id": 1,
        "user_id": 2
      }
    }
    ```

#### Add Feedback

- **URL**: `/causes/:id/feedback`
- **Method**: `POST`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Cause ID
- **Request Body**:
  - `rating`: Rating (1-5) (required)
  - `comment`: Feedback comment (optional)
- **Success Response**:
  - **Code**: 201 CREATED
  - **Content**:
    ```json
    {
      "success": true,
      "feedback": {
        "id": 1,
        "rating": 5,
        "comment": "Feedback comment",
        "cause_id": 1,
        "user_id": 2
      }
    }
    ```

#### Follow Cause

- **URL**: `/causes/:id/follow`
- **Method**: `POST`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Cause ID
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Cause followed successfully",
      "isFollowing": true
    }
    ```

#### Unfollow Cause

- **URL**: `/causes/:id/unfollow`
- **Method**: `POST`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Cause ID
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Cause unfollowed successfully",
      "isFollowing": false
    }
    ```

### Users

#### Update Profile

- **URL**: `/users/profile`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `name`: User name
  - `avatar`: Avatar image file
  - `bio`: User bio
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "user": {
        "id": 1,
        "name": "Updated Name",
        "email": "user@example.com",
        "avatar": "/uploads/avatar.jpg",
        "bio": "Updated bio"
      },
      "token": "updated-jwt-token"
    }
    ```

#### Get User Contributions

- **URL**: `/users/contributions`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "contributions": [
        {
          "id": 1,
          "amount": 100,
          "food_quantity": 5,
          "message": "Contribution message",
          "anonymous": false,
          "cause_id": 1,
          "cause_title": "Cause Title",
          "cause_image": "/uploads/image.jpg",
          "created_at": "2023-01-01T00:00:00.000Z"
        }
      ]
    }
    ```

#### Get Followed Causes

- **URL**: `/users/followed-causes`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "causes": [
        {
          "id": 1,
          "title": "Cause Title",
          "description": "Cause description",
          "image": "/uploads/image.jpg",
          "location": "Location",
          "category": "emergency",
          "funding_goal": 5000,
          "current_funding": 2500,
          "food_goal": 100,
          "current_food": 50,
          "status": "active",
          "created_at": "2023-01-01T00:00:00.000Z"
        }
      ]
    }
    ```

### Notifications

#### Get User Notifications

- **URL**: `/notifications`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "notifications": [
        {
          "id": 1,
          "title": "Notification Title",
          "message": "Notification message",
          "type": "contribution",
          "cause_id": 1,
          "cause_title": "Cause Title",
          "is_read": false,
          "created_at": "2023-01-01T00:00:00.000Z"
        }
      ],
      "unreadCount": 3
    }
    ```

#### Mark Notification as Read

- **URL**: `/notifications/:id/read`
- **Method**: `PUT`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Notification ID
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "notification": {
        "id": 1,
        "is_read": true
      }
    }
    ```

#### Mark All Notifications as Read

- **URL**: `/notifications/read-all`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "All notifications marked as read"
    }
    ```

### Admin

#### Get Stats

- **URL**: `/admin/stats`
- **Method**: `GET`
- **Auth Required**: Yes (admin only)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "stats": {
        "userCount": 100,
        "causeCount": 50,
        "contributionCount": 200,
        "totalFunding": 25000
      }
    }
    ```

#### Toggle Admin Status

- **URL**: `/admin/users/:id/toggle-admin`
- **Method**: `PUT`
- **Auth Required**: Yes (admin only)
- **URL Parameters**:
  - `id`: User ID
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "user": {
        "id": 1,
        "name": "User Name",
        "email": "user@example.com",
        "is_admin": true
      }
    }
    ```

#### Moderate Cause

- **URL**: `/admin/causes/:id/moderate`
- **Method**: `PUT`
- **Auth Required**: Yes (admin only)
- **URL Parameters**:
  - `id`: Cause ID
- **Request Body**:
  - `status`: New status (active or suspended)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "cause": {
        "id": 1,
        "title": "Cause Title",
        "status": "active"
      },
      "message": "Cause approved successfully"
    }
    ```

## Error Handling

All endpoints return error responses in a consistent format:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common error status codes:

- 400: Bad Request (validation errors)
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Server Error

For validation errors, the response may include an errors array:

```json
{
  "success": false,
  "errors": [
    {
      "param": "email",
      "msg": "Please provide a valid email"
    }
  ]
}
```
