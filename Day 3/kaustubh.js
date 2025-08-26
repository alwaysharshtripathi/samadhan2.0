let employees = [
    { name: "Rahul", salary: [20000, 22000, 21000] },
    { name: "Priya", salary: [25000, 26000, 27000] }
];

for (let i = 0; i < employees.length; i++) {
    let emp = employees[i];
    let total = 0;

    for (let j = 0; j < emp.salary.length; j++) {
        total = total + emp.salary[j];
    }

    let average = total / emp.salary.length;

    console.log("   Employee:", emp.name);
    console.log("   Salaries:", emp.salary);
    console.log("   Total Salary:", total);
    console.log("   Average Salary:", average);
    console.log("-----------------------------");
}
