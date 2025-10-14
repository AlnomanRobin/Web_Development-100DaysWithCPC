function showSquare() {
  let num = 5;
  const square = (n) => n * n;
  document.getElementById("output").innerText = "Square of 5 = " + square(num);
}

function showGreeting() {
  const greet = (name = "Guest") => `Welcome, ${name}!`;
  document.getElementById("output").innerText = greet("Robin");
}

function compareNumbers() {
  const larger = (a, b) => (a > b ? a : b);
  document.getElementById("output").innerText = "Larger number: " + larger(10, 7);
}
