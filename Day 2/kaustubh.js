let marks = [89, 55, 102, 36, 77, 336, 111, 0, 108];

function findHighest(array) {
    let highest = array[0];
    for (let i = 1; i < array.length; i++) {
        if (array[i] > highest) {
            highest = array[i];
        }
    }
    return highest;
}

let maxMarks = findHighest(marks);
console.log(" Highest Marks:", maxMarks);