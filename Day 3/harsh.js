let students = [
    { name: "Meenakashi", marks: [78, 83, 89] },
    { name: "Kumkum", marks: [92, 88, 95] },
    { name: "Vedika", marks: [70, 65, 82] }
];

students.forEach(student => {
    let total = student.marks.reduce((sum, m) => sum + m, 0);

    let average = total / student.marks.length;

    console.log(`${student.name}`);
    console.log("   Marks:", student.marks);
    console.log("   Total:", total);
    console.log("   Average:", average.toFixed(2));
});
