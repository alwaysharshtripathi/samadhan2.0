import { useEffect, useState } from "react";

export default function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white">
      <h1 className="text-4xl font-bold text-center mb-8">🎓 Student Directory</h1>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {students.map((s) => (
          <div
            key={s.id}
            className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-xl hover:scale-105 transition"
          >
            <h2 className="text-2xl font-semibold">{s.name}</h2>
            <p className="mt-2 text-lg">Course: {s.course}</p>
            <p className="text-lg">Year: {s.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
