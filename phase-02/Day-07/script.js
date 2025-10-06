let movies = [];
let btn = document.getElementById("addMovie");
let list = document.getElementById("movieList");

btn.addEventListener("click", function() {
  let movie = document.getElementById("movieInput").value.trim();

  if (movie === "") {
    alert("⚠️ Please enter a movie name!");
    return;
  }

  movies.push(movie);
  document.getElementById("movieInput").value = "";

  displayMovies();
});

function displayMovies() {
  list.innerHTML = "";
  for (let i = 0; i < movies.length; i++) {
    let li = document.createElement("li");
    li.textContent = `${i + 1}. ${movies[i]}`;
    list.appendChild(li);
  }
}
