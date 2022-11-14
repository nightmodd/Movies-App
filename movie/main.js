//global varibles
const key = "0544e732b88a2287b7288288339c30cf";
const TMDB_IMAGE_PATH = "https://image.tmdb.org/t/p/original";

//getting the Movie ID
const url = window.location.href;
const id = url.substring(url.lastIndexOf("=") + 1);
console.log(id);

//for button to scroll the related section
function scrollL() {
  var left = document.querySelector(".scroll-films");
  left.scrollBy(350, 0);
}
function scrollRight() {
  var right = document.querySelector(".scroll-films");
  right.scrollBy(-350, 0);
}

//getall movie's data
const getData = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${key}&language=en-US`
    );
    if (!res.ok) throw Error("Can't get the response");
    const json = await res.json();

    return json;
  } catch (err) {
    console.error(err);
  }
};

//load first section
const loadMovieData = async () => {
  const { title, name, genres, backdrop_path } = await getData();

  let imgURL = `${TMDB_IMAGE_PATH}${backdrop_path}`;

  const gettingData = ` <img  src="${imgURL}" alt="${name}" />
  <div class ="shadow-img"> </div>
            <div class="film-info">
                <span id="film-title">${title}</span>
                <div class="category">
                    <ul>
                        <li>${genres.map((genre) => genre.name).join(" ,")}</li>
                       
                    </ul>
                </div>
                
              `;

  document.getElementById("film").innerHTML = gettingData;
};

//load overView section
const loadOverview = async () => {
  const { overview } = await getData();
  const storyLine = `<span class="section-title">StoryLine</span>
  <p>${overview} </p>`;

  document.getElementById("overview").innerHTML = storyLine;
};
//get the film's video

const getVideo = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${key}&language=en-US`
    );
    if (!res.ok) throw Error("Can't get the response");
    const json = await res.json();

    return json;
  } catch (err) {
    console.error(err);
  }
};

const loadVideo = async () => {
  const videoResponse = await getVideo();

  const officialVideos = videoResponse.results
    .filter((video) => {
      return (
        (video.official === true &&
          video.site === "YouTube" &&
          video.type === "Trailer" &&
          video.name === "Official Trailer") ||
        (video.official === true &&
          video.site === "YouTube" &&
          video.type === "Trailer" &&
          video.name === "Trailer")
      );
    })
    .map((videoTrailer) => {
      return `<iframe width="80%" height="500" src="https://www.youtube.com/embed/${videoTrailer.key}" title="YouTube video player"
       frameborder="3" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;
        picture-in-picture" allowfullscreen></iframe>`;
    })
    [0];
  
  if (officialVideos.length > 0) {
    const videoDiv = ` <div class="section video" >
            <span class="section-title">Teaser/Trailer</span>
            <br />
            <div id="video">
             ${officialVideos}   
            </div>`;
    
    document.getElementById("videodiv").innerHTML = videoDiv; 
  }
   

};

//load related movies
// similar api : https://api.themoviedb.org/3/movie/${id}/similar?api_key=${key}&language=en-US&page=1
//recomendation api : https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${key}&language=en-US&page=1
const getRelatedMovies = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${key}&language=en-US&page=1`
    );
    if (!res.ok) throw Error("Can't get the response");
    const json = await res.json();

    return json.results;
  } catch (err) {
    console.error(err);
  }
};

const loadRelatedMovies = async () => {
  const movies = await getRelatedMovies();
  const relatedMovies = movies
    .map((movie) => {
      const { title, poster_path, id } = movie;
      let imgURL = `${TMDB_IMAGE_PATH}${poster_path}`;
      return `
                   <a href="index.html?id=${id}"> <li class="scrollable-film"><img src="${imgURL}" alt="ponocio" />
                        <span>${title}</span>
                    </li>
                     </a>
                   
        `;
    })
    .join("");
  document.getElementById("related_movies").innerHTML = relatedMovies;
};

window.addEventListener("load", loadMovieData);
window.addEventListener("load", loadOverview);
window.addEventListener("load", loadVideo);
window.addEventListener("load", loadRelatedMovies);
