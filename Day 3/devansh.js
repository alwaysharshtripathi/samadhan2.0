let student = {
    name: "Devansh",
    marks: [82, 70, 88]
};

let total = 0;

for (let i = 0; i < student.marks.length; i++) {
    total = total + student.marks[i];
}
let average = total / student.marks.length;

console.log("Student Name:", student.name);
console.log("Marks:", student.marks);
console.log("Total Marks:", total);
console.log("Average Marks:", average);
