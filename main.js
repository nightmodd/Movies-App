const TMDB_IMAGE_PATH = "https://image.tmdb.org/t/p/w500";
const getTrending = async () => {
  try {
    const res = await fetch(
      "https://api.themoviedb.org/3/trending/all/day?api_key=0544e732b88a2287b7288288339c30cf"
    );
    if (!res.ok) throw Error("Can't get the response");
    const json = await res.json();

    return json.results;
  } catch (err) {
    console.error(err);
  }
};

/**dummy  */
const getvideo = async () => {
  try {
    const res = await fetch(
      "https://api.themoviedb.org/3/movie/682507/videos?api_key=0544e732b88a2287b7288288339c30cf&language=en-US"
    );
    if (!res.ok) throw Error("Can't get the response");
    const json = await res.json();

    return json.results;
  } catch (err) {
    console.error(err);
  }
};

const loadTrendingMovies = async () => {
  const movies = await getTrending();

  let imgURL1 = `${TMDB_IMAGE_PATH}${movies[0].backdrop_path}`;
  const data1 = `
      <a href="/movie?id=${movies[0].id}">
       <img src="${imgURL1}" alt="${movies[0].title || movies[0].name}" />
        <div class="shadow-div"></div>
        <div class="film-info">
        <span>${movies[0].title || movies[0].name}</span>
        <span class="rank">1</span>
          </div>
     </a>`;

  document.getElementById("first-trending").innerHTML = data1;

  const remainingTrending = movies
    .slice(1)
    .map((movie, index) => {
      const { title, backdrop_path, name, id } = movie;

      let imgURL = `${TMDB_IMAGE_PATH}${backdrop_path}`;
      return `
      <a href="/movie?id=${id}">
        <li>
          <img src="${imgURL}" alt="${title || name}" />
           <div class="shadow-div"></div>
           <div class="film-info">
          <span>${title || name}</span>
          <span class="rank">${index + 2}</span>
          </div>
        </li>      
        </a>
      `;
    })
    .join();
  document.getElementById("list").innerHTML = remainingTrending;
};

/*
get random movie for Recommended section
*/
const getMovieData = async () => {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing?api_key=0544e732b88a2287b7288288339c30cf&language=en-US&page=1"
    );
    if (!response.ok) throw Error(response.statusText);
    const json = await response.json();
    return json.results[Math.floor(Math.random() * json.results.length)];
  } catch (error) {
    console.error(error);
  }
};
const loadImage = async () => {
  const anchor = document.createElement("a");
  const image = document.createElement("img");
  const movie = await getMovieData();
  image.setAttribute(
    "src",
    `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
  );
  image.classList.add("img-style");
  anchor.setAttribute("href", `/movie?id=${movie.id}`);
  anchor.style.display = "block";

  anchor.append(image);
  document.getElementById("latest").appendChild(anchor);
};

/*for popular moives */
const getPopularMovies = async () => {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/discover/movie?api_key=0544e732b88a2287b7288288339c30cf&sort_by=popularity.desc & include_adult=true & include_video=false & page=1 & year=2021 & with_watch_monetization_types=flatrate"
    );
    if (!response.ok) throw Error(response.statusText);
    const json = await response.json();
    return json.results[Math.floor(Math.random() * json.results.length)];
  } catch (error) {
    console.error(error);
  }
};

/**for searching  for specific movie */
const getSearch = async (searchValue) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=0544e732b88a2287b7288288339c30cf&language=en-US&page=1&include_adult=false&query=${searchValue}`
    );
    if (!res.ok) throw Error("Can't get the response");
    const json = await res.json();
    const searchedMovies = json.results;
    console.log(searchedMovies);

    return searchedMovies;
  } catch (err) {
    console.error(err);
  }
};

const loadSearch = async (search) => {
  if (search === "") {
    document.getElementById("search-list").style.display = "none";
    document.getElementById("skeleton-list").style.display = "block";
    return;
  }

  const searchQueue = await getSearch(search);
  const serchQuery = searchQueue
    .filter(({ backdrop_path }) => backdrop_path)
    .map((movie) => {
      const { backdrop_path, id } = movie;

      let imgURL = `https://image.tmdb.org/t/p/w500${backdrop_path}`;
      return ` <a href="/movie?id=${id}">
       <li>
          <div class="inner-div">
            <img src="${imgURL}" alt="">
          </div>
        </li>
        </a>`;
    })
    .join();
  document.getElementById("search-list").innerHTML = serchQuery;
  document.getElementById("search-list").style.display = "block";
  document.getElementById("skeleton-list").style.display = "none";
};

let timer;
const searchBar = document.getElementById("search-bar");

searchBar.addEventListener("keyup", (e) => {
  const searchWord = e.target.value;
  clearTimeout(timer);
  timer = setTimeout(() => loadSearch(searchWord), 500);
});

loadTrendingMovies();
window.addEventListener("load", loadImage);

getvideo();
