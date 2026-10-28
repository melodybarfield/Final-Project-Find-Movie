let isModalOpen = false;
const moviesGridEl = document.querySelector(".movies-grid");

function openMenu() {
  document.body.classList += " menu--open";
}

function closeMenu() {
  document.body.classList.remove("menu--open");
}

function toggleModal() {
  if (isModalOpen) {
    isModalOpen = false;
    return document.body.classList.remove("modal--open");
  }
  isModalOpen = true;
  document.body.classList += " modal--open";
}

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

const apiKey = "4c54bb9f";
const movieGrid = document.getElementById("movieGrid");
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");

searchButton.addEventListener("click", function () {
  const query = searchInput.value;
  fetchMovies(query);
});

async function fetchMovies(query) {
  const response = await fetch(
    `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`,
  );
  const data = await response.json();
  displayMovies(data.Search.slice(0, 8));
}

function displayMovies(movies) {
  movieGrid.innerHTML = "";
  if (!movies) {
    movieGrid.innerHTML = "<p>No movies found.</p>";
    return;
  }

  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie-card");
    movieElement.innerHTML = `
    <img src="${movie.Poster}" alt="${movie.Title}" class="movie-card__img">
    <h2 class="movie-card__title">${movie.Title}</h2>
    <p class="movie-card__year">${movie.Year}</p>
    `;
    movieGrid.appendChild(movieElement);
  });
}
