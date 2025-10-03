// Day 2 - Variables & Data Types

let name = "Shawon";
let age = 21;
let isStudent = true;

let btn = document.getElementById("show");
let output = document.getElementById("output");

btn.addEventListener("click", function() {
  output.innerHTML = `Name: ${name}, Age: ${age}, Student: ${isStudent}`;
  console.log("Name:", name);
  console.log("Age:", age);
  console.log("Is Student?", isStudent);
  console.log("Type of age:", typeof age);
});
