let students = require("../data/students");

// Get all students
const getStudents = (req, res) => {
  res.json(students);
};

// Get single student by ID
const getStudentById = (req, res) => {
  const { id } = req.params;
  const student = students.find((s) => s.id === parseInt(id));
  student ? res.json(student) : res.status(404).json({ message: "Student not found" });
};

// Add new student
const addStudent = (req, res) => {
  const { name, age, grade } = req.body;
  const newStudent = {
    id: students.length + 1,
    name,
    age,
    grade,
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
};

// Update student
const updateStudent = (req, res) => {
  const { id } = req.params;
  const { name, age, grade } = req.body;
  const student = students.find((s) => s.id === parseInt(id));

  if (student) {
    student.name = name || student.name;
    student.age = age || student.age;
    student.grade = grade || student.grade;
    res.json(student);
  } else {
    res.status(404).json({ message: "Student not found" });
  }
};

// Delete student
const deleteStudent = (req, res) => {
  const { id } = req.params;
  const index = students.findIndex((s) => s.id === parseInt(id));

  if (index !== -1) {
    const deleted = students.splice(index, 1);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ message: "Student not found" });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
};
