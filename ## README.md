## Node.js API Documentation Guide

This guide will walk you through the steps to **set up, run, and test** a Node.js API with user authentication using JSON Web Tokens (JWT).

### Prerequisites

- Node.js and npm installed.
- XAMPP or MySQL Server installed and running.
- Postman for testing APIs.

---

## 1. Project Setup

1. Create a new folder for your project (e.g., `nextjsapi`).
2. Navigate to your project directory and initialize a new Node.js project:

```bash
npm init -y
```

3. Install necessary packages:

```bash
npm install express mysql bcrypt jsonwebtoken body-parser
```

---

## 2. Create MySQL Database

1. Open **phpMyAdmin** or your preferred MySQL client.
2. Create a new database:

```sql
CREATE DATABASE condiments;
```

3. Create `users` and `assigned_entities` tables:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE assigned_entities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);
```

---

## 3. Create `index.js` File

Create an `index.js` file with the following content:

```javascript
// index.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());

// Secret key for JWT
const SECRET_KEY = 'geyksonGwapo';

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'condiments'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// API Endpoints here...

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

---

## 4. Run Your Server

Start your server with:

```bash
node index.js
```

You should see:

```
Server running at http://localhost:5000
Connected to MySQL database.
```

---

## 5. Testing with Postman

You'll need to test various endpoints with Postman. We'll cover them all next.

### 5.1 Register User

- **URL:** `http://localhost:5000/api/register`
- **Method:** `POST`
- **Body:** `JSON`

```json
{
  "username": "testuser",
  "password": "password123"
}
```

- **Response:**

```
User registered successfully.
```

### 5.2 Login User

- **URL:** `http://localhost:5000/api/login`
- **Method:** `POST`
- **Body:** `JSON`

```json
{
  "username": "testuser",
  "password": "password123"
}
```

- **Response:**

```json
{
  "token": "<JWT_TOKEN>"
}
```

Make sure to **copy the token** for the next requests.

### 5.3 Create Assigned Entity (Protected Route)

- **URL:** `http://localhost:5000/api/assigned_entity`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Body:** `JSON`

```json
{
  "name": "My Entity",
  "description": "This is a test entity."
}
```

- **Response:**

```
Entity created successfully.
```

### 5.4 View All Entities (Protected Route)

- **URL:** `http://localhost:5000/api/assigned_entity`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response:**

```json
[
  {
    "id": 1,
    "name": "My Entity",
    "description": "This is a test entity."
  }
]
```

### 5.5 View Entity By ID (Protected Route)

- **URL:** `http://localhost:5000/api/assigned_entity/:id`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response:**

```json
{
  "id": 1,
  "name": "My Entity",
  "description": "This is a test entity."
}
```

### 5.6 Update Entity (Protected Route)

- **URL:** `http://localhost:5000/api/assigned_entity`
- **Method:** `PUT`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Body:** `JSON`

```json
{
  "id": 1,
  "name": "Updated Entity",
  "description": "This is an updated description."
}
```

- **Response:**

```
Entity updated successfully.
```

### 5.7 Delete Entity (Protected Route)

- **URL:** `http://localhost:5000/api/assigned_entity/:id`
- **Method:** `DELETE`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response:**

```
Entity deleted successfully.
```

---

## 6. Troubleshooting & Common Errors

1. **Database Connection Errors:**

   - Make sure your MySQL server is running.
   - Check your connection details (host, user, password, database name).

2. **JWT Authentication Errors:**

   - Ensure you send the token in the `Authorization` header as: `Bearer <JWT_TOKEN>`.
   - Make sure your token is not expired.

3. **CORS Errors (if accessing from a frontend app):**

   - Install and use the `cors` middleware:

   ```bash
   npm install cors
   ```

   ```javascript
   const cors = require('cors');
   app.use(cors());
   ```

Now, your API documentation is complete and well-organized. ✅

