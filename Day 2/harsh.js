let marks = [78, 92, 85, 67, 99, 74];

function findHighest(arr) {
    let highest = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > highest) {
            highest = arr[i];
        }
    }
    return highest;
}

let topMarks = findHighest(marks);
console.log(" Highest Marks :", topMarks);
