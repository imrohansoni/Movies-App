import { API_KEY } from './API_KEY.js';
import { genres } from './genre.js';

const container = document.querySelector('.container');
const form = document.querySelector('.form');
const search = document.querySelector('.search');
const watchListButton = document.querySelector('.watch_list_btn');
const homeButton = document.querySelector('.home_btn');

const watchList = [];
const moviesList = [];

const IMAGE_URL = 'https://image.tmdb.org/t/p/w1280';

const init = function () {
  getWatchList();
  getMovies('discover');
  addToWatchLetter();
  displayHome();
  searchMovies();
  displayWatchList();
};

const getMovies = async function (query, movie_name) {
  let movie;
  try {
    movie = await fetch(
      `https://api.themoviedb.org/3/${query}/movie?${
        query === 'discover' ? 'sort_by=popularity.desc' : `query=${movie_name}`
      }&api_key=${API_KEY}&page=1`
    );
  } catch (err) {
    console.log(err);
  }

  const data = await movie.json();
  displayMovies(data.results, false);
  moviesList.push(...data.results);
};

const displayMovies = function (movies, byId) {
  container.textContent = ``;

  movies.forEach((movie) => {
    if (!movie) return;

    const genreName =
      !movie.genre_ids.length < 1
        ? genres.find((i) => i.id === movie.genre_ids[0]).name
        : '';

    const rating = movie.vote_average;
    const ratingColor =
      rating >= 7.5 ? 'best' : rating >= 6 && rating < 7.5 ? 'good' : 'bad';
    const markup = `
     <div class="movie ${
       watchList.findIndex((m) => m.id === movie.id) > -1 ? 'liked' : ''
     }" data-movie_id="${movie.id ? movie.id : ''}">
            <div class="poster">
                <img src="${IMAGE_URL}${movie.poster_path}" alt="">
                <div class="poster_details">
                    <span class="title">
                        ${movie.original_title || 'no title'}
                    </span>
                    <div class="rating_genre">
                        <span class="rating ${ratingColor}">
                            ${rating}
                        </span>
                        ${
                          genreName
                            ? `<span class="genre">${genreName}</span>`
                            : ''
                        }
                    </div>
                </div>
            </div>
            <div class="data">
                <span class="title">
                    ${movie.original_title}
                </span>
                <div class="rating_genre">
                    <span class="rating ${ratingColor}">
                         ${rating}
                    </span>
                    ${
                      genreName ? `<span class="genre">${genreName}</span>` : ''
                    }
                    <button class="add_to_watch_list"><i class="far fa-heart"></i></button>
                </div>
                <span class="release_date">
                    release date :<span class="release">
                        ${movie.release_date}
                    </span>
                </span>
                <span class="overview">
                   ${movie.overview}
                </span>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeEnd', markup);
  });
};

const searchMovies = function () {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const movie_name = search.value;

    getMovies('search', movie_name);
  });
};

const addToWatchLetter = function () {
  container.addEventListener('click', function (e) {
    if (e.target.closest('.add_to_watch_list')) {
      const movieCard = e.target.closest('.movie');
      const id = movieCard.dataset.movie_id;
      if (!id) return;

      const watchListIndex = watchList.findIndex((mov) => mov.id === +id);

      if (watchListIndex > -1) {
        watchList.splice(watchListIndex, 1);
        movieCard.classList.remove('liked');
      } else {
        const movie = moviesList.find((m) => m.id === +id);
        watchList.push(movie);
        movieCard.classList.add('liked');
      }
      localStorage.setItem('watchList', JSON.stringify(watchList));
    }
  });
};

const displayWatchList = function () {
  watchListButton.addEventListener('click', function () {
    displayMovies(watchList);
  });
};

const displayHome = function () {
  homeButton.addEventListener('click', function () {
    getMovies('discover');
  });
};

const getWatchList = function () {
  const watchListedMovies = localStorage.getItem('watchList');
  if (!watchListedMovies) return;
  watchList.push(...JSON.parse(watchListedMovies));
};

init();
