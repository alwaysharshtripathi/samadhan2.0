const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all origins so the React client can access it
app.use(cors());
app.use(express.json());

// In-memory store (no database)
let todos = [];
let nextId = 1;

// GET /todos -> fetch all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST /todos -> add new todo
// expects JSON { "text": "task" }
app.post('/todos', (req, res) => {
  const { text } = req.body || {};
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Please provide a non-empty "text" field.' });
  }
  const todo = { id: nextId++, text: text.trim(), createdAt: new Date().toISOString() };
  todos.push(todo);
  res.status(201).json(todo);
});

// DELETE /todos/:id -> delete by ID
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  const [removed] = todos.splice(idx, 1);
  res.json(removed);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ To-Do API running on http://localhost:${PORT}`);
});
