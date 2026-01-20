# Sou Gas Backend API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### 1. Register User
**Endpoint:** `POST /auth/register`

**Description:** Register a new user (Customer or Driver).

**Payload:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer" // or "driver"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### 2. Login User
**Endpoint:** `POST /auth/login`

**Description:** Login with email and password to get an access token.

**Payload:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### 3. Get Current User (Me)
**Endpoint:** `GET /auth/me`

**Description:** Get current logged-in user details.

**Headers:**
`Authorization: Bearer <token>`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ca",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "createdAt": "2021-06-21T10:00:00.000Z",
    "__v": 0
  }
}
```

### 4. Forgot Password
**Endpoint:** `POST /auth/forgotpassword`

**Description:** Request a password reset code via email.

**Payload:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": "Email sent"
}
```

### 5. Verify Code
**Endpoint:** `POST /auth/verifycode`

**Description:** Verify the reset code sent to email.

**Payload:**
```json
{
  "email": "john@example.com",
  "code": "1234"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": "Code verified"
}
```

### 6. Reset Password
**Endpoint:** `PUT /auth/resetpassword`

**Description:** Reset password using the verification code.

**Payload:**
```json
{
  "email": "john@example.com",
  "code": "1234",
  "password": "newpassword123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

## Error Responses
**Format:**
```json
{
  "success": false,
  "error": "Error message description"
}
```
