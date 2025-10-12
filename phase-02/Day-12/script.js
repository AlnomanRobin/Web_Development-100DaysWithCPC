let numbers = [10, 25, 50, 75, 100];
let arrayDisplay = document.getElementById("arrayDisplay");
let result = document.getElementById("result");

function showArray() {
  arrayDisplay.textContent = `[ ${numbers.join(", ")} ]`;
}

showArray();

document.getElementById("doubleBtn").addEventListener("click", () => {
  let doubled = numbers.map(num => num * 2);
  result.textContent = `Doubled: [ ${doubled.join(", ")} ]`;
});

document.getElementById("filterBtn").addEventListener("click", () => {
  let filtered = numbers.filter(num => num > 50);
  result.textContent = `Filtered (>50): [ ${filtered.join(", ")} ]`;
});

document.getElementById("sumBtn").addEventListener("click", () => {
  let sum = numbers.reduce((total, num) => total + num, 0);
  result.textContent = `Sum of all: ${sum}`;
});

document.getElementById("resetBtn").addEventListener("click", () => {
  result.textContent = "";
  showArray();
});
