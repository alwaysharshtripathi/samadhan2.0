# 💬 Real-Time Chat Application

A full-stack, real-time chat application inspired by Telegram. Built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with Socket.io for live messaging, typing indicators, and user presence status.

![Project Screenshot Placeholder](https://user-images.githubusercontent.com/83282836/223402434-8c8f3319-3e3d-4c3e-9c24-4f0547c126d4.png)
_**Note:** Replace the image URL above with a screenshot or a GIF of your running application!_

---

## ✨ Features

- **Real-time Messaging**: Instant message delivery and updates using Socket.io.
- **Secure User Authentication**: JWT-based authentication for signup and login.
- **Online Presence**: See which users are currently online and view their "last seen" status.
- **Typing Indicators**: Know when another user is typing a message in your chat.
- **Message Status**: See delivered (✓) and read (✓✓) receipts for messages.
- **Chat Management**: Start new one-on-one conversations and view your chat history.
- **Responsive UI**: A clean, modern, and responsive user interface built with React and styled with Tailwind CSS.

---

## 🛠️ Tech Stack

| Backend                              | Frontend             |
| ------------------------------------ | -------------------- |
| **Node.js**                          | **React.js (Vite)**  |
| **Express.js**                       | **Tailwind CSS**     |
| **MongoDB** with **Mongoose**        | **Socket.io-client** |
| **Socket.io**                        | **Axios**            |
| **JSON Web Token (JWT)**             | **React Router DOM** |
| **bcryptjs** for password hashing    |                      |
| **dotenv** for environment variables |                      |

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- **Node.js** (v18.x or higher recommended)
- **npm** or **yarn**
- **MongoDB**: Make sure you have a running instance of MongoDB (either locally or on a cloud service like MongoDB Atlas).

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/telegram-like-chat.git](https://github.com/your-username/telegram-like-chat.git)
    cd telegram-like-chat
    ```

2.  **Setup the Backend:**

    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create an environment file from the example
    cp .env.example .env
    ```

    Now, open the newly created `.env` file and fill in the required variables (see [Environment Variables](#-environment-variables) section below).

3.  **Setup the Frontend:**

    ```bash
    # Navigate to the frontend directory from the root
    cd ../frontend

    # Install dependencies
    npm install
    ```

4.  **Run the Application:**

    - **Start the backend server** (from the `/backend` directory):

      ```bash
      npm start
      ```

      The server will be running on the port you specified in your `.env` file (e.g., `http://localhost:8000`).

    - **Start the frontend development server** (from the `/frontend` directory):
      ```bash
      npm run dev
      ```
      The React app will be available at `http://localhost:5173` (or another port if 5173 is busy).

5.  **Open your browser** and navigate to `http://localhost:5173` to use the app!

---

## 🔑 Environment Variables

The backend requires the following environment variables. Create a `.env` file in the `/backend` directory and add the following:

```env
# Server Port
PORT=8000

# MongoDB Connection URI
MONGO_URL=mongodb://localhost:27017/chatapp

# JWT Secret Key for signing tokens
JWT_SECRET=your_super_secret_jwt_key

# The origin URL of your frontend client for CORS
CLIENT_ORIGIN=http://localhost:5173
```

---

## 📝 API Endpoints & Socket Events

### REST API

| Method | Endpoint                  | Description                             |
| ------ | ------------------------- | --------------------------------------- |
| `POST` | `/api/auth/signup`        | Register a new user.                    |
| `POST` | `/api/auth/login`         | Log in an existing user.                |
| `GET`  | `/api/users`              | Get a list of all users.                |
| `GET`  | `/api/users/online`       | Get a list of online users.             |
| `GET`  | `/api/chats`              | Get all chats for the logged-in user.   |
| `POST` | `/api/chats/with/:userId` | Get or create a chat with another user. |
| `GET`  | `/api/messages/:chatId`   | Get all messages for a specific chat.   |

### Socket.io Events

- **Server Emits:**

  - `status { userId, isOnline, lastSeen }`: Broadcasts when a user connects or disconnects.
  - `message { action: 'send', message }`: Broadcasts a new message to relevant users.
  - `message { action: 'read', ... }`: Broadcasts that messages have been read.
  - `typing { chatId, from, isTyping }`: Broadcasts when a user is typing.

- **Client Emits:**
  - `message { action: 'send', ... }`: Send a new message.
  - `message { action: 'read', ... }`: Mark messages as read.
  - `typing { chatId, to, isTyping }`: Notify the server about typing status.

---

## 🗺️ Future Roadmap

- [ ] Group Chats
- [ ] File & Image Sharing
- [ ] User Profile Customization (e.g., avatars)
- [ ] Push Notifications
- [ ] End-to-end Encryption

---

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
