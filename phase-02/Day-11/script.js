let fruits = ["Apple", "Banana", "Mango"];
let fruitList = document.getElementById("fruitList");
let countText = document.getElementById("count");

function displayFruits() {
  fruitList.innerHTML = "";
  for (let fruit of fruits) {
    let li = document.createElement("li");
    li.textContent = fruit;
    fruitList.appendChild(li);
  }
  countText.textContent = `Total Fruits: ${fruits.length}`;
}

displayFruits();

document.getElementById("addFruit").addEventListener("click", () => {
  let newFruit = prompt("Enter a new fruit name:");
  if (newFruit) {
    fruits.push(newFruit);
    displayFruits();
  }
});

document.getElementById("removeFruit").addEventListener("click", () => {
  fruits.pop();
  displayFruits();
});
