# User Registration API

## Endpoint

```
POST /user/register
```

## Description

This API endpoint is used to **register a new user** in the system.

When a user sends their registration details:

1. The request data is validated using **express-validator**.
2. The password is **hashed using bcrypt** before storing it in the database.
3. A new user document is created in **MongoDB**.
4. A **JWT authentication token** is generated for the user.
5. The API returns the token and the created user data.

---

# Request Data

The API expects a **JSON body** with the following structure:

```json
{
  "fullname": {
    "firstname": "Abhishek",
    "lastname": "Yadav"
  },
  "email": "abhishek@gmail.com",
  "password": "12345678"
}
```

---

# Request Fields

| Field              | Type   | Required | Description                            |
| ------------------ | ------ | -------- | -------------------------------------- |
| fullname.firstname | String | Yes      | User first name (minimum 3 characters) |
| fullname.lastname  | String | No       | User last name                         |
| email              | String | Yes      | Valid email address                    |
| password           | String | Yes      | User password (minimum 6 characters)   |

---

# Validation Rules

The following validations are applied:

* Email must be a **valid email address**
* First name must contain **at least 3 characters**
* Password must contain **at least 6 characters**

Example validation code:

```
body('email').isEmail()
body('fullname.firstname').isLength({min:3})
body('password').isLength({min:6})
```

---

# Success Response

### Status Code

```
200 OK
```

### Response Body

```json
{
  "token": "JWT_TOKEN",
  "userData": {
    "_id": "65f1234567abc",
    "fullname": {
      "firstname": "Abhishek",
      "lastname": "Yadav"
    },
    "email": "abhishek@gmail.com"
  }
}
```

---

# Error Responses

## Validation Error

If validation fails, the API returns:

### Status Code

```
400 Bad Request
```

### Response

```json
{
  "errors": [
    {
      "msg": "Invalid Email"
    }
  ]
}
```

---

## Missing Fields Error

If required fields are missing:

### Status Code

```
400 Bad Request
```

### Response

```json
{
  "message": "All Fields Are required"
}
```

---

# Authentication Token

After successful registration, the API generates a **JWT token**.

Example token generation:

```
jwt.sign({_id:this._id}, process.env.JWT_SECRET)
```

This token can be used for accessing **protected routes** in the application.

Example header for protected APIs:

```
Authorization: Bearer JWT_TOKEN
```

---

# Password Security

Passwords are **never stored as plain text**.

Before saving the user:

```
bcrypt.hash(password,10)
```

The password is **hashed and stored securely** in the database.

---

# Database Model

User data is stored in MongoDB with the following schema fields:

| Field              | Type            |
| ------------------ | --------------- |
| fullname.firstname | String          |
| fullname.lastname  | String          |
| email              | String          |
| password           | String (hashed) |
| socketId           | String          |

---

# Example Postman Request

### Method

```
POST
```

### URL

```
http://localhost:3000/user/register
```

### Body

```
Body → raw → JSON
```

```json
{
  "fullname": {
    "firstname": "Abhishek",
    "lastname": "Yadav"
  },
  "email": "studyandrotech@gmail.com",
  "password": "12345678"
}
```

---

# API Flow

```
Client
   ↓
POST /user/register
   ↓
Validation (express-validator)
   ↓
Controller
   ↓
Service
   ↓
MongoDB
   ↓
JWT Token Generation
   ↓
Response to Client
```
