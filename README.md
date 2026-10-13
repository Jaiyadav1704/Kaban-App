# Kanban Task Management App

A full-stack Kanban task management application that helps users organize workspaces, manage boards, track tasks across columns, and collaborate through task assignments and comments.

## Overview

This project was built to practice and demonstrate full-stack web development, including REST API development, authentication, relational database design, and frontend state management.

The application uses React for the frontend and Node.js with Express for the backend. PostgreSQL stores the application data, while Prisma ORM manages database access and migrations.


## Features

- User registration and login with JWT-based authentication
- Create and manage workspaces
- Create boards within workspaces
- Organize tasks into columns
- Set task priorities and due dates
- Assign tasks to users
- Add comments to tasks
- Store application data in a PostgreSQL database


## Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Axios
- Vite

### Backend
- Node.js
- Express.js
- JWT authentication
- bcrypt for password hashing

### Database
- PostgreSQL
- Prisma ORM


## Installation and Setup

### Prerequisites

Make sure you have the following installed:

- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Jaiyadav1704/Kaban-App.git
cd Kaban-App
```

### 2. Set up the backend

```bash
cd Backend
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Update `.env` with your own PostgreSQL connection string and JWT secret.

### 3. Set up the database


Create a PostgreSQL database using your preferred PostgreSQL client (for example, `psql` or pgAdmin). Update `DATABASE_URL` in your `.env` file to point to that database.

Then apply the database migrations:

```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Start the backend

```bash
npm run dev
```

The backend runs at `http://localhost:5001`.

### 5. Set up and start the frontend

Open a **new terminal** from the project root and run:

```bash
cd Frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.



## Project Structure

```text
Kaban-App/
├── Backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── Controller/
│   │   ├── Middleware/
│   │   ├── Prisma/
│   │   ├── Route/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── prisma.config.ts
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── component/
│   │   ├── context/
│   │   ├── pages/
│   │   └── routes/
│   ├── package.json
│   └── vite.config.js
└── README.md
```
