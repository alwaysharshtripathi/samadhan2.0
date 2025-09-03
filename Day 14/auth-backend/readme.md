# Full-Stack Authentication System

This is a full-stack authentication system built with Node.js, Express, MongoDB, and a custom-designed frontend. It provides user registration and login functionalities secured with JSON Web Tokens (JWT).

## Features

* **User Registration:** Create a new user account with a username, email, and password.
* **User Login:** Authenticate existing users and issue a JWT for secure access.
* **Secure Password Hashing:** Passwords are encrypted using `bcryptjs` before being stored in the database.
* **JWT-based Authentication:** The system utilizes `jsonwebtoken` for stateless authentication.
* **MongoDB Integration:** User data is stored in a MongoDB database using the `mongoose` library.
* **Beautiful Frontend:** A sleek, animated login and signup page with a cosmic theme is included.

## Technologies Used

### Backend
* **Node.js:** JavaScript runtime environment.
* **Express.js:** Web application framework for Node.js.
* **MongoDB:** NoSQL database.
* **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.
* **bcryptjs:** Library for hashing passwords.
* **jsonwebtoken:** Library to implement JWT.
* **dotenv:** To manage environment variables.

### Frontend
* **HTML:** Structure of the web page.
* **CSS:** Styling and animations (pure CSS, no framework).
* **JavaScript:** To handle form submissions and interact with the backend API.

## Getting Started

### Prerequisites

* Node.js installed on your machine.
* A running instance of MongoDB.

### Installation

1.  Clone the repository or download the project files.
2.  Navigate to the project directory:
    ```bash
    cd auth-backend
    ```
3.  Install the required Node.js packages:
    ```bash
    npm install
    ```

### Configuration

Create a `.env` file in the root directory of the project and add the following environment variables:

````

PORT=5000
MONGO\_URI=mongodb://127.0.0.1:27017/auth\_demo
JWT\_SECRET=supersecretkey

````

* **PORT**: The port the server will run on. The default is 5000.
* **MONGO_URI**: Your MongoDB connection string. Ensure your MongoDB is running and the database name matches the one in the URI.
* **JWT_SECRET**: A random string used to sign and verify JWTs. **For a production application, use a long, strong, and random key.**

### Running the Application

1.  Make sure your MongoDB server is running.
2.  Start the Express server:
    ```bash
    npm start
    ```
    (or `npm run dev` if you have `nodemon` installed for automatic restarts).
3.  Open your web browser and navigate to `http://localhost:5000`.

## API Endpoints

The backend exposes the following API endpoints under the `/api/auth` base path:

### `POST /api/auth/register`
Registers a new user.

* **Request Body:**
    ```json
    {
      "username": "testuser",
      "email": "test@example.com",
      "password": "strongpassword123"
    }
    ```
* **Success Response:**
    * **Status:** `201 Created`
    * **Body:**
        ```json
        {
          "msg": "User registered successfully"
        }
        ```

### `POST /api/auth/login`
Authenticates a user and returns a JWT.

* **Request Body:**
    ```json
    {
      "email": "test@example.com",
      "password": "strongpassword123"
    }
    ```
* **Success Response:**
    * **Status:** `200 OK`
    * **Body:**
        ```json
        {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          "user": {
            "id": "5f...f1",
            "username": "testuser",
            "email": "test@example.com"
          }
        }
        ```
