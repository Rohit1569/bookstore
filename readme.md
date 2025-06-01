Project Setup Instruction
 1.Clone the repository

 2.Add environment variables
   Create a .env file in the root directory with the following:
    JWT_SECRET_KEY=RohitSecretKey
    JWT_EXPIRY=1h
    AUTH_COOKIE_NAME=auth_token

 3.Set up the database
   Open pgAdmin or any PostgreSQL client.
   Create a new database:app_db

 4.Run database migrations
   npx sequelize-cli db:migrate

 5.Install dependencies
    npm install

How to Run Locally
 Start the development server:
 run: npm run dev

Example API Requests
 User Signup
 Route:
 POST /api/v1/user/signup
 Request Body (JSON):{
  "username": "testuser",
  "password": "securepassword123"
}

Postman Example:
 Method: POST
 URL: http://127.0.0.1:20200/api/v1/user/signup
 Body → Raw → JSON:{
  "username": "testuser",
  "password": "securepassword123"
}


Design Decisions & Assumptions
 Database:
 PostgreSQL (app_db) is assumed to be running locally.

 Environment Config:
 A .env file is required to store sensitive details like DB credentials and JWT secrets.

 Error Handling:
 Service functions (like getBooks) use database transactions to ensure rollback on errors.

 Pagination Defaults:
 When no limit or offset is provided in query params, the system defaults to:

 limit: 10 

 offset: 0 

 Modular Helpers:
 Helpers like parseSelectFields, parseFilterQueries are used to cleanly construct Sequelize queries.


  Database Schema Overview
This project has three main tables: users, books, and reviews.

Tables
 users
id (UUID, primary key)

name (string, optional)

age (integer, optional)

gender (string, optional)

is_admin (boolean, optional)

username (string, required, unique)

password (string, required, hashed)

created_at, updated_at, deleted_at (timestamps; soft deletes enabled)

books
id (UUID, primary key)

image_url (string, optional)

title (string, optional)

author (string, required)

genre (string, optional)

description (text, optional)

published_date (date, optional)

created_at, updated_at (timestamps)

reviews
id (UUID, primary key)

user_id (UUID, foreign key → users.id, required)

book_id (UUID, foreign key → books.id, required)

rating (integer, 1–5, optional)

review_text (text, optional)

created_at, updated_at (timestamps)

Relationships
One user can have many books.

One book can have many reviews.

Each review belongs to one user and one book.

