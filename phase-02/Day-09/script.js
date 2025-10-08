let movies = [];
let list = document.getElementById("movieList");
let total = document.getElementById("totalMovies");

// Function to show movies
function displayMovies(arr) {
  list.innerHTML = "";
  arr.forEach((movie, index) => {
    let li = document.createElement("li");
    li.textContent = `${index + 1}. ${movie}`;

    // Delete button
    let delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.classList.add("delete-btn");
    delBtn.addEventListener("click", () => deleteMovie(index));

    li.appendChild(delBtn);
    list.appendChild(li);
  });

  total.textContent = `Total Movies: ${arr.length}`;
}

// Function to add movie
function addMovie() {
  let movie = document.getElementById("movieInput").value.trim();
  if (movie === "") {
    alert("Please enter a movie name!");
    return;
  }

  movies.push(movie);
  document.getElementById("movieInput").value = "";
  displayMovies(movies);
}

// Function to delete single movie
function deleteMovie(index) {
  movies.splice(index, 1);
  displayMovies(movies);
}

// Function to clear all movies
function clearAll() {
  movies = [];
  displayMovies(movies);
}

// Search filter
document.getElementById("searchMovie").addEventListener("input", (e) => {
  let keyword = e.target.value.toLowerCase();
  let filtered = movies.filter(m => m.toLowerCase().includes(keyword));
  displayMovies(filtered);
});

// Event Listeners
document.getElementById("addMovie").addEventListener("click", addMovie);
document.getElementById("clearAll").addEventListener("click", clearAll);
