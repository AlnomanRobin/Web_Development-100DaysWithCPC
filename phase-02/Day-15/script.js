let fruits = ["Apple", "Banana", "Mango"];

function addFruit() {
  let fruit = document.getElementById("fruitInput").value;
  if (fruit) {
    fruits.push(fruit);
    document.getElementById("output").innerText = fruit + " added!";
    document.getElementById("fruitInput").value = "";
  } else {
    document.getElementById("output").innerText = "Please enter a fruit name!";
  }
}

function removeFruit() {
  if (fruits.length > 0) {
    let removed = fruits.pop();
    document.getElementById("output").innerText = removed + " removed!";
  } else {
    document.getElementById("output").innerText = "No fruits to remove!";
  }
}

function showFruits() {
  if (fruits.length > 0) {
    document.getElementById("output").innerText = "Fruits: " + fruits.join(", ");
  } else {
    document.getElementById("output").innerText = "List is empty!";
  }
}
