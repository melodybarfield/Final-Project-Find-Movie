let isModalOpen = false;
const moviesGridEl = document.querySelector(".movies-grid");
const apiKey = "4c54bb9f";
const movieGrid = document.getElementById("movieGrid");
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const results__Info = document.getElementById("resultsInfo");
const sortSelect = document.querySelector("#sortSelect");
const loadingSpinner = document.querySelector(".movie__loading-spinner");
let currentMovies = [];
let currentSearch = "";

// Open and close the burger menu for the website for smaller screens

function openMenu() {
  document.body.classList += " menu--open";
}

function closeMenu() {
  document.body.classList.remove("menu--open");
}

// Toggle the modal for contact form

function toggleModal() {
  if (isModalOpen) {
    isModalOpen = false;
    return document.body.classList.remove("modal--open");
  }
  isModalOpen = true;
  document.body.classList += " modal--open";
}

// Handle contact form submission and send email using EmailJS

function contact(event) {
  event.preventDefault();
  const loading = document.querySelector(".modal__overlay--loading");
  const success = document.querySelector(".modal__overlay--success");
  loading.classList += " modal__overlay--visible";
  emailjs
    .sendForm(
      "service_dso5y18",
      "template_ilw36jj",
      event.target,
      "lUInOT4KOXFuYh21a",
    )
    .then(() => {
      loading.classList.remove("modal__overlay--visible");
      success.classList += " modal__overlay--visible";
    })
    .catch(() => {
      loading.classList.remove("modal__overlay--visible");
      alert(
        "The email service is temporarily unavailable. Please contact me directly on melody.hoppe@googlemail.com",
      );
    });
}

// Search movies based on user input and trigger the fetchMovies function

function searchMovies() {
  const query = searchInput.value.trim();
  if (query === "") {
    movieGrid.innerHTML = "";
    return;
  }
  fetchMovies(query);
}

searchButton.addEventListener("click", searchMovies);
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovies();
  }
});

// Fetch movies from the OMDB API based on the search query

async function fetchMovies(query) {
  loadingSpinner.style.display = "block";

  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`,
    );
    const data = await response.json();
    currentMovies = data.Search || [];
    currentSearch = query;
    displayMovies(currentMovies.slice(0, 8), currentSearch);
  } catch (error) {
    console.log("Something went wrong:", error);
    movieGrid.innerHTML = "<p>Something went wrong.<br> Please try again.</p>";
  } finally {
    loadingSpinner.style.display = "none";
  }
}

// Display movies in the grid based on the search query dynamically creating div elements for each movie

function displayMovies(movies, searchedMovie) {
  movieGrid.innerHTML = "";

  results__Info.textContent = `Showing: ${searchedMovie}`;
  searchInput.value = "";

  if (!movies) {
    movieGrid.innerHTML = "<p>No movies found.</p>";
    return;
  }

  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "";
    movieElement.classList.add("movie-card");
    movieElement.innerHTML = `
    ${poster ? `<img src="${poster}" alt="${movie.Title}" class="movie-card__img">` : `<div class="movie-card__img">No poster available</div>`}
    <h2 class="movie-card__title">${movie.Title}</h2>
    <p class="movie-card__year">${movie.Year}</p>
    `;

    if (poster) {
      const img = movieElement.querySelector("img");
      img.addEventListener("error", () => {
        const fallback = document.createElement("div");
        fallback.className = "movie-card__img";
        fallback.textContent = "No poster available";
        img.replaceWith(fallback);
      });
    }
    movieGrid.appendChild(movieElement);
  });
}

// Sort movies using dropdown selection

function sortMovies() {
  let sortedMovies = [...currentMovies];
  if (sortSelect.value === "a-z") {
    sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortSelect.value === "z-a") {
    sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (sortSelect.value === "newest") {
    sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (sortSelect.value === "oldest") {
    sortedMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  }
  displayMovies(sortedMovies.slice(0, 8), currentSearch);
}

sortSelect.addEventListener("change", sortMovies);

// Catches searched word from first website and triggers auto-search

window.addEventListener("DOMContentLoaded", () => {
  // 1. Read the URL parameters from the browser address bar
  const urlParams = new URLSearchParams(window.location.search);
  const lookedForMovie = urlParams.get("movie");

  // 2. Check if a movie title was passed in the URL
  if (lookedForMovie) {
    // 3. Find the search input box on Website 2 and fill it with the movie title
    const searchInput = document.getElementById("searchInput");
    searchInput.value = lookedForMovie;

    // 4. Trigger your existing search function to display the movie posters
    fetchMovies(lookedForMovie);
  }
});
