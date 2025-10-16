let quotes = [
  { text: "Dream big. Work hard. Stay humble.", author: "Unknown" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "JavaScript is the duct tape of the Internet.", author: "Charlie Campbell" },
  { text: "Don’t wish it were easier. Wish you were better.", author: "Jim Rohn" }
];

let quoteText = document.getElementById("quote");
let authorText = document.getElementById("author");
let btn = document.getElementById("btn");

btn.addEventListener("click", function() {
  let random = Math.floor(Math.random() * quotes.length);
  quoteText.innerText = `"${quotes[random].text}"`;
  authorText.innerText = `— ${quotes[random].author}`;
});
