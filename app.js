import { API_KEY } from './API_KEY.js';
import { genres } from './genre.js';

const container = document.querySelector('.container');
const form = document.querySelector('.form');
const search = document.querySelector('.search');

const watchList = [];
const moviesList = [];

const IMAGE_URL = 'https://image.tmdb.org/t/p/w1280';

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
  console.log(data.results);

  moviesList.push(...data.results);
  console.log(moviesList);
};

const displayMovies = function (movies, byId) {
  container.textContent = ``;

  movies.forEach((movie) => {
    const genreName = genres.find((i) => i.id === movie.genre_ids[0]).name;
    const rating = movie.vote_average;
    const ratingColor =
      rating >= 7.5 ? 'best' : rating >= 6 && rating < 7.5 ? 'good' : 'bad';
    const markup = `
     <div class="movie ${
       watchList.findIndex((m) => m.id === movie.id) > -1 ? 'liked' : ''
     }" data-movie_id="${movie.id}">
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
                        <span class="genre">${genreName}</span>
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
                    <span class="genre">${genreName}</span>
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

getMovies('discover');

const searchMovies = function () {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const movie_name = search.value;

    getMovies('search', movie_name);
  });
};

searchMovies();

const addToWatchLetter = function () {
  const addToWatchLetterButton =
    document.querySelectorAll('.add_to_watch_list');

  container.addEventListener('click', function (e) {
    if (e.target.closest('.add_to_watch_list')) {
      const movieCard = e.target.closest('.movie');
      const id = movieCard.dataset.movie_id;

      const watchListIndex = watchList.findIndex((mov) => mov.id === +id);

      if (watchListIndex > -1) {
        watchList.splice(watchListIndex, 1);
        movieCard.classList.remove('liked');
        return;
      }

      const movie = moviesList.find((m) => m.id === +id);
      watchList.push(movie);
      movieCard.classList.add('liked');
    }
  });
};

addToWatchLetter();

const displayWatchList = function () {
  const watchListButton = document.querySelector('.watch_list_btn');
  watchListButton.addEventListener('click', function () {
    displayMovies(watchList);
  });
};

const displayHome = function () {
  const homeButton = document.querySelector('.home_btn');

  homeButton.addEventListener('click', function () {
    getMovies('discover');
  });
};

displayHome();

displayWatchList();
