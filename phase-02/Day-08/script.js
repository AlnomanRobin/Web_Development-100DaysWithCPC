let movies = [];
let list = document.getElementById("movieList");
let total = document.getElementById("totalMovies");

document.getElementById("addMovie").addEventListener("click", () => {
  let movie = document.getElementById("movieInput").value.trim();
  if (movie === "") {
    alert("Please enter a movie name!");
    return;
  }

  movies.push(movie);
  document.getElementById("movieInput").value = "";
  displayMovies(movies);
});

document.getElementById("searchMovie").addEventListener("input", (e) => {
  let keyword = e.target.value.toLowerCase();
  let filtered = movies.filter(m => m.toLowerCase().includes(keyword));
  displayMovies(filtered);
});

function displayMovies(arr) {
  list.innerHTML = "";
  arr.forEach((movie, index) => {
    let li = document.createElement("li");
    li.textContent = `${index + 1}. ${movie}`;
    list.appendChild(li);
  });

  // show total movies count using reduce()
  let count = arr.reduce(count => count + 1, 0);
  total.textContent = `Total Movies: ${count}`;
}
