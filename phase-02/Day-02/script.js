// select elements
let text = document.getElementById("text");
let btn = document.getElementById("btn");

// add click event
btn.addEventListener("click", function() {
  text.innerHTML = "You clicked the button! 🎉";
  text.style.color = "crimson";
});