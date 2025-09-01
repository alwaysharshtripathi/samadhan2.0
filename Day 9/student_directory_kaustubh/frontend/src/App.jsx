import React, { useEffect, useState } from "react";
import StudentList from "./components/StudentList";
import "./App.css"; // make sure CSS is applied

function App() {
  const [students, setStudents] = useState([]);

  // Fetch students from backend
  useEffect(() => {
    fetch("http://localhost:5000/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  return (
    <div className="container">
      <div className="title">
        <img src="/cap.png" alt="Graduation Cap" />
        <h1>Student Directory</h1>
      </div>
      <StudentList students={students} />
    </div>
  );
}

export default App;
