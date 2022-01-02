import { API_KEY } from './API_KEY.js';
import { genres } from './genre.js';

const container = document.querySelector('.container');
const form = document.querySelector('.form');
const search = document.querySelector('.search');

const watchList = [];

const IMAGE_URL = 'https://image.tmdb.org/t/p/w1280';

const getMovies = async function () {
  const movie = await fetch(
    `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=1`
  );

  const data = await movie.json();
  console.log(data);

  displayMovies(data);
};

const displayMovies = function (movies) {
  container.textContent = ``;

  movies.results.forEach((movie) => {
    const genreName = genres.find((i) => i.id === movie.genre_ids[0]).name;
    const rating = movie.vote_average;
    const ratingColor =
      rating >= 7.5 ? 'best' : rating >= 6 && rating < 7.5 ? 'good' : 'bad';
    const markup = `
     <div class="movie best" data-movie_id="${movie.id}">
            <div class="poster">
                <img src="${IMAGE_URL}${movie.poster_path}" alt="">
                <div class="poster_details">
                    <span class="title">
                        ${movie.original_title}
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
                    <button class="add_to_watch_list active"><i class="far fa-heart"></i></button>
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

getMovies();

const searchMovies = function () {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const search_id = search.value;

    console.log(search.value);
  });
};

searchMovies();

const addToWatchLetter = function () {
  const addToWatchLetterButton =
    document.querySelectorAll('.add_to_watch_list');

  container.addEventListener('click', function (e) {
    if (e.target.closest('.add_to_watch_list')) {
      console.log('watch list button');
      const movieCard = e.target.closest('.movie');
      const id = movieCard.dataset.movie_id;
      watchList.push(id);
      localStorage.setItem('watchList', watchList);
    }
  });
};

addToWatchLetter();

const getWatchListedMovies = async function () {
  const movies = localStorage.getItem('watchList');

  if (movies.split(',').length < 1) return;

  movies.split(',').forEach(async (search_id) => {
    const movie = await fetch(
      `https://api.themoviedb.org/3/movie/${search_id}?api_key=${API_KEY}&language=en-US`
    );

    const d = await movie.json();
    console.log(d);
  });
};

const watchListButton = document.querySelector('.watch_list_btn');

getWatchListedMovies();
