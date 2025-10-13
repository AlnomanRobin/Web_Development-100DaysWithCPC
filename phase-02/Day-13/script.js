let numbers = [10, 25, 50, 75, 100];
let arrayDisplay = document.getElementById("arrayDisplay");
let result = document.getElementById("result");

function showArray() {
  arrayDisplay.textContent = `[ ${numbers.join(", ")} ]`;
}

showArray();

// forEach
document.getElementById("forEachBtn").addEventListener("click", () => {
  let text = "";
  numbers.forEach(num => text += num + " ");
  result.textContent = `All values: ${text}`;
});

// find
document.getElementById("findBtn").addEventListener("click", () => {
  let found = numbers.find(num => num > 50);
  result.textContent = found
    ? `First number > 50: ${found}`
    : `No number found > 50`;
});

// includes
document.getElementById("includesBtn").addEventListener("click", () => {
  let has25 = numbers.includes(25);
  result.textContent = has25
    ? "✅ Array includes 25"
    : "❌ Array does not include 25";
});

// sort
document.getElementById("sortBtn").addEventListener("click", () => {
  let sorted = [...numbers].sort((a, b) => a - b);
  result.textContent = `Sorted: [ ${sorted.join(", ")} ]`;
});

// splice
document.getElementById("spliceBtn").addEventListener("click", () => {
  let newArray = [...numbers];
  newArray.splice(2, 1);
  result.textContent = `After removing 3rd item: [ ${newArray.join(", ")} ]`;
});

// reset
document.getElementById("resetBtn").addEventListener("click", () => {
  result.textContent = "";
  showArray();
});
