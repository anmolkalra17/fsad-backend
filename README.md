# Book Exchange Transaction Management

## Overview

This project is a Book Exchange Transaction Management system that allows users to manage their book exchanges. Users can track the status of all their exchange transactions, view a history of their exchange requests, cancel pending exchanges, and receive notifications when a transaction status changes.

## Features

- **Transaction History**: Users can view a history of their exchange requests, including pending, accepted, and completed exchanges.
- **Cancel Pending Exchanges**: Users can cancel pending exchange requests.
- **Notifications**: Users receive notifications when a transaction status changes (e.g., request accepted, book delivered).
- **Profile Page**: Transaction history is available to users on their profile page.

## Installation

1. **Install dependencies**:
    ```bash
    npm install
    ```

2. **Set up environment variables**:
    Create a `.env` file in the root directory and add the following:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

3. **Run the server**:
    ```bash
    npm start
    ```

## API Endpoints

### User

- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`
- **Reset Password**: `POST /api/auth/reset-password`
- **Logout**: `POST /api/auth/logout`

### Books

- **Add a Book**: `POST /api/books/add`
- **Edit a Book**: `PUT /api/books/edit/:id`
- **Delete a Book**: `DELETE /api/books/delete/:id`
- **Get all Books**: `GET /api/books/`
- **Get Book by Id**: `GET /api/books/:id`
- **Search Books**: `GET /api/books/search?query=`

### Transactions

- **Get Transaction History**: `GET /api/transactions/history`
- **Get User Transactions**: `GET /api/transactions/received`
- **Create Transaction**: `POST /api/transactions/create`
- **Update Transaction Status**: `PUT /api/transactions/update/:id`
- **Cancel Transaction**: `DELETE /api/transactions/cancel/:id`

### User Profile

- **Get User Profile**: `GET /api/users/profile`

## Models

### User

- `username`: Username for a registered user.
- `email`: Email address of the registered user.
- `password`: Password of the registeres user (Encrypted before storing in the database).

### Books

- `uuid`: Unique identifier for a book.
- `user`: Reference to the user who added the book.
- `title`: Name of the book.
- `author`: Author of the book.
- `genre`: Book genre.
- `condition`: Book condition.
- `available`: Book is available or not.
- `createdAt`: A timestamp when the book was added to the system.
- `thumbnail`: The book cover fetched from the Google Books API.

### Transaction

- `userId`: Reference to the user who initiated the transaction.
- `bookId`: Reference to the book being exchanged.
- `recipientUserId`: The user to whom the borrow request is sent.
- `status`: Status of the transaction (`pending`, `accepted`, `completed`, `canceled`).
- `createdAt`: Timestamp when the transaction was created.
- `updatedAt`: Timestamp when the transaction was last updated.