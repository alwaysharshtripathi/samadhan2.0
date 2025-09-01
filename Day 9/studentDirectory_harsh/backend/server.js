const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy students data
let students = [
  { id: 1, name: "Shreya", age: 20 },
  { id: 2, name: "Satyam", age: 21 },
  { id: 3, name: "Ayush", age: 21 }
];

// Root route
app.get('/', (req, res) => {
  res.send("🎉 Student API running!");
});

// GET all students
app.get('/students', (req, res) => {
  res.json(students);
});

// POST new student
app.post('/students', (req, res) => {
  const newStudent = {
    id: students.length + 1,
    name: req.body.name,
    age: req.body.age
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
