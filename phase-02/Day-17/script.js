let btn = document.getElementById("changeColor");
let input = document.getElementById("colorInput");
let message = document.getElementById("message");

btn.addEventListener("click", function() {
  let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  document.body.style.background = randomColor;
  message.innerText = "Background changed to: " + randomColor;
});

input.addEventListener("input", function() {
  document.body.style.background = input.value;
  message.innerText = "Custom color applied: " + input.value;
});
