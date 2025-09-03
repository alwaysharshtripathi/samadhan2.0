# Full-Stack To-Do App (Express + React/Vite/Tailwind)

## Requirements implemented
- **Backend (Node.js + Express)**
  - REST API with endpoints:
    - `GET /todos` → Fetch all todos
    - `POST /todos` with JSON `{ "text": "task" }` → Add a new todo
    - `DELETE /todos/:id` → Delete a todo by ID
  - Uses an **in-memory array** (no database).
  - **CORS enabled** so the React frontend can access it.
  - Runs on **port 5000** by default.
- **Frontend (React + Vite + Tailwind)**
  - Displays todos fetched from backend.
  - Form to add a new todo.
  - Each todo has a **Delete** button.
  - Clean, modern UI using **Tailwind CSS**.
  - Dev server runs on **port 5173**.
- **Project Layout**
  - `server/` → Node backend
  - `client/` → React frontend

---

## Quickstart

**Prereqs:** Node.js 18+ and npm.

1. Unzip the project.
2. In one terminal, start the backend:
   ```bash
   cd server
   npm install
   npm start
   # -> API on http://localhost:5000
   ```
3. In a second terminal, start the frontend:
   ```bash
   cd client
   npm install
   npm run dev
   # -> App on http://localhost:5173
   ```

The app should load and list todos. Add new tasks with the input at the top; remove them with the Delete button.

---

## Notes
- Data lives in memory only and resets when the server restarts.
- If you run the frontend or backend on different hosts/ports, update `API_URL` in `client/src/App.jsx`.
