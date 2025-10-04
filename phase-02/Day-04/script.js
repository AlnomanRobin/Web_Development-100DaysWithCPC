// Day 3 - Operators & Expressions

let btn = document.getElementById("calculate");
let output = document.getElementById("output");

btn.addEventListener("click", function() {
  let n1 = parseFloat(document.getElementById("num1").value);
  let n2 = parseFloat(document.getElementById("num2").value);

  if(isNaN(n1) || isNaN(n2)) {
    output.innerHTML = "⚠️ Please enter valid numbers!";
    return;
  }

  let sum = n1 + n2;
  let sub = n1 - n2;
  let mul = n1 * n2;
  let div = (n2 !== 0) ? (n1 / n2).toFixed(2) : "∞";

  output.innerHTML = `
    ➕ Sum: ${sum} <br>
    ➖ Sub: ${sub} <br>
    ✖️ Mul: ${mul} <br>
    ➗ Div: ${div}
  `;
});