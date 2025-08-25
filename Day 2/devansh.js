let scores = [45, 120, 88, 200, 67, 99, 150];

let highest = scores[0];
for (let i = 1; i < scores.length; i++) {
    if (scores[i] > highest) {
        highest = scores[i];
    }
}

console.log("Highest Score:", highest);
