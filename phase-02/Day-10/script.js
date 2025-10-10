// Load existing movies from localStorage
let movies = JSON.parse(localStorage.getItem("movies")) || [];

const movieList = document.getElementById("movieList");
const movieInput = document.getElementById("movieInput");
const totalMovies = document.getElementById("totalMovies");

// ✅ Display all movies
function displayMovies(arr) {
  movieList.innerHTML = "";
  arr.forEach((movie, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${movie}`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.classList.add("delete-btn");
    delBtn.addEventListener("click", () => deleteMovie(index));

    li.appendChild(delBtn);
    movieList.appendChild(li);
  });
  totalMovies.textContent = `Total Movies: ${arr.length}`;
  localStorage.setItem("movies", JSON.stringify(movies));
}

// ✅ Add a new movie
function addMovie() {
  const movie = movieInput.value.trim();
  if (movie === "") {
    alert("Please enter a movie name!");
    return;
  }
  movies.push(movie);
  movieInput.value = "";
  displayMovies(movies);
}

// ✅ Delete a movie
function deleteMovie(index) {
  movies.splice(index, 1);
  displayMovies(movies);
}

// ✅ Clear all movies
function clearAll() {
  if (confirm("Are you sure you want to clear all movies?")) {
    movies = [];
    displayMovies(movies);
  }
}

// ✅ Filter/Search movies
document.getElementById("searchMovie").addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = movies.filter(m => m.toLowerCase().includes(keyword));
  displayMovies(filtered);
});

// ✅ Event listeners
document.getElementById("addMovie").addEventListener("click", addMovie);
document.getElementById("clearAll").addEventListener("click", clearAll);

// Initial render
displayMovies(movies);
