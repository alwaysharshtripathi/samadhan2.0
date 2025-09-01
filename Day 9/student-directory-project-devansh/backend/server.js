import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let students = [
  { id: 1, name: "Devansh", course: "CSE", year: "3rd" },
  { id: 2, name: "Ananya", course: "IT", year: "2nd" },
  { id: 3, name: "Rohan", course: "ECE", year: "1st" }
];

app.get("/students", (req, res) => {
  res.json(students);
});

app.listen(5000, () => console.log("✅ Server running at http://localhost:5000"));
