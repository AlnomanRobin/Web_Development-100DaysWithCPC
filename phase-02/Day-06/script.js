let btn = document.getElementById("generate");
let output = document.getElementById("output");

btn.addEventListener("click", function() {
  let num = parseInt(document.getElementById("number").value);

  if (isNaN(num)) {
    output.innerHTML = "⚠️ Please enter a valid number!";
    return;
  }

  let table = `<h3>Multiplication Table of ${num}</h3>`;
  
  for (let i = 1; i <= 10; i++) {
    table += `${num} × ${i} = ${num * i}<br>`;
  }

  output.innerHTML = table;
});
