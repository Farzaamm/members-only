# Members Only

A backend application that implements authentication and restricted content access. Users can sign up, log in, and access protected resources based on their membership status.

## 🚀 Features

* User registration and login
* Password hashing for security
* Authentication system (session or token-based)
* Protected routes (members-only content)
* Basic role or permission handling

## 🛠️ Tech Stack

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL (or configured database)
* Authentication (Passport.js or JWT)

## 📁 Project Structure

```bash
.
├── prisma/            # Database schema and migrations
├── src/
│   ├── controllers/  # Route logic
│   ├── routes/       # API endpoints
│   ├── middlewares/  # Auth and error handling
│   └── utils/        # Helper functions
├── app.js            # Main application entry point
├── package.json
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Farzaamm/members-only.git
cd members-only
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```
DATABASE_URL=your_database_url
SESSION_SECRET=your_secret
PORT=3000
```

### 4. Setup database

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Run the app

```bash
node app.js
```

## 📌 API Overview

### Auth

| Method | Endpoint  | Description     |
| ------ | --------- | --------------- |
| POST   | /register | Create new user |
| POST   | /login    | Log in user     |
| POST   | /logout   | Log out user    |

### Protected

| Method | Endpoint | Description          |
| ------ | -------- | -------------------- |
| GET    | /members | Members-only content |

## 🔐 Authentication

* Passwords are securely hashed
* Sessions or tokens are used for authentication
* Protected routes require authentication

## ⚠️ Notes

* This is a learning project
* Minimal validation and error handling
* Not production-ready

## 📄 License

MIT License
