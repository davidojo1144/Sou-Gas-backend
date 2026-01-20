# Sou Gas Backend API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### 1. Register User (Step 1)
**Endpoint:** `POST /auth/register`

**Description:** Register a new user. The role can be omitted (defaults to 'customer') or included if known.

**Payload:**
```json
{
  "fullName": "John Doe",
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

### 2. Update User Details / Select Role (Step 2)
**Endpoint:** `PUT /auth/updatedetails`

**Description:** Update user details, such as setting the role after registration.

**Headers:**
`Authorization: Bearer <token>`

**Payload:**
```json
{
  "role": "driver" // or "customer"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ca",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "driver",
    "__v": 0
  }
}
```

### 3. Login User
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

### 4. Get Current User (Me)
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

### 5. Forgot Password
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

### 6. Verify Code
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

### 7. Reset Password
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
