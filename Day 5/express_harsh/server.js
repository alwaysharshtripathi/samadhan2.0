const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let students = [
  { id: 1, name: "Ajay", age: 21 },
  { id: 2, name: "Shreya", age: 20 },
  { id: 3, name: "Deepak", age: 25 }
];

app.get('/', (req, res) => {
  res.send("Welcome to the Express.js API! \n\nAvailable routes:\nGET /students\nPOST /students");
});

app.get('/students', (req, res) => {
  res.json(students);
});

app.post('/students', (req, res) => {
  const newStudent = {
    id: students.length + 1,
    name: req.body.name,
    age: req.body.age
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
