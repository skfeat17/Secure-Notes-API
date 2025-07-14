
# 🔐 Secure Notes API

A privacy-focused encrypted notes API where even the server can't read your data. Built using Node.js, Express, MongoDB, bcrypt, JWT, and AES-256 encryption.

---

## 🚀 Features

- 🔐 **End-to-End Encryption** of notes
- 🔏 **JWT Authentication**
- 🧂 **Bcrypt Password Hashing**
- 🗂️ **CRUD API for Encrypted Notes**
- 🔍 **Per-User Notes Tracking**
- 📆 Automatic timestamps (`createdAt`, optional `updatedAt`)

---

## 🧠 How It Works

- When a user signs up or logs in, the client uses the **raw password** (never stored) to derive a secret key.
- This key is used with AES encryption (via `simple-crypto-js`) to **encrypt/decrypt each note**.
- The JWT payload includes an encrypted fingerprint to **prevent token forgery**.
- The **server cannot decrypt notes** — only the user can.

---

## 📦 Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- bcrypt for hashing
- jsonwebtoken (JWT)
- simple-crypto-js (AES-256)
- dotenv for config

---

## 📁 Folder Structure

```
.
├── controllers/
│   ├── authControllers.js
│   └── utilityController.js
├── routes/
│   └── routes.js
├── schema.js
├── .env
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Setup

### 1. Clone and Install

```bash
git clone https://github.com/your-username/secure-notes-api.git
cd secure-notes-api
npm install
```

### 2. Create `.env`

```bash
cp .env.example .env
```

---

## 🔐 .env Example

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/secure-notes
JWT_KEY=your-256bit-jwt-secret-goes-here
CRYPTO_KEY=your-256bit-crypto-salt-goes-here
```

---

## 📡 API Endpoints

> All endpoints require: `Authorization: Bearer <token>` except `/signup` and `/login`

---

### 🧾 `POST /signup`

Registers a new user.

**Request:**
```json
{
  "name": "John",
  "username": "john123",
  "password": "secret"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sign Up Sucessfull",
  "userToken": "<JWT>"
}
```

---

### 🔓 `POST /login`

Logs in and returns a JWT.

**Request:**
```json
{
  "username": "john123",
  "password": "secret"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Log in Successful",
  "userToken": "<JWT>"
}
```

---

### 👤 `GET /profile`

Gets the user's public profile and note count.

**Headers:**  
`Authorization: Bearer <token>`

**Response:**
```json
{
  "name": "John",
  "username": "john123",
  "joinedAt": "2025-07-14T12:34:56.000Z",
  "totalNotes": 3
}
```

---

### 📝 `POST /note/create`

Creates a new encrypted note.

**Headers:**  
`Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "Shopping List",
  "content": "Milk, Bread, Coffee"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note Posted Successfully"
}
```

---

### 📄 `GET /note/get`

Returns all decrypted notes for the user.

**Headers:**  
`Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "notes": [
    {
      "id": "6874ff06661a78e9ebec667a",
      "title": "Shopping List",
      "content": "Milk, Bread, Coffee",
      "createdAt": "2025-07-14T12:58:45.941Z"
    }
  ]
}
```

---

### ✏️ `PUT /note/put`

Updates a note by ID.

**Headers:**  
`Authorization: Bearer <token>`

**Body:**
```json
{
  "id": "6874ff06661a78e9ebec667a",
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note updated",
  "notes": [ ... ]
}
```

---

### ❌ `DELETE /note/delete`

Deletes a note by ID.

**Headers:**  
`Authorization: Bearer <token>`

**Body:**
```json
{
  "id": "6874ff06661a78e9ebec667a"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note Deleted",
  "notes": [ ... ]
}
```

---

## 🐳 Optional: Docker Setup

### Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]
```

### .dockerignore

```
node_modules
.env
```

### Build and Run

```bash
docker build -t secure-notes-api .
docker run -p 5000:5000 --env-file .env secure-notes-api
```

---

## 🛡️ Security Highlights

- Notes are encrypted using a key generated from the user's **real password** (never stored)
- Only the client can decrypt the data
- Server stores only encrypted content
- JWTs contain a secure fingerprint to prevent token forgery
- Even if the DB and `.env` are compromised, notes remain unreadable without the original password

---

## 📄 License

MIT — use freely, stay secure.
