import React, { useEffect, useState } from "react";

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/students") // backend API
      .then((res) => res.json())
      .then((data) => setStudents(data));
  }, []);

  return (
    <ul className="student-list">
      {students.map((student, index) => (
        <li key={index} className="student-card">
          <strong>{student.name}</strong> (Age: {student.age})
        </li>
      ))}
    </ul>
  );
}

export default StudentList;
