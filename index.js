// fetching data function
const autoCompleteConfig = {
  renderOption(movie) {
    let imageSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src="${imageSrc}"/>
    ${movie.Title}
`;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "beff32af",
        s: searchTerm
      }
    });
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;

  }

};


createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');

    onMovieSelect(movie, document.querySelector('#left-summary'), 'leftMovie');
  }

});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');

    onMovieSelect(movie, document.querySelector('#right-summary'), 'rightMovie');
  }

});



let rightMovie;
let leftMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "beff32af",
      i: movie.imdbID
    }
  });
  summaryElement.innerHTML = movieTemplate(response.data);
  if (side === 'leftMovie') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }
  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStat = document.querySelectorAll('#left-summary .notification');
  const rightSideStat = document.querySelectorAll('#right-summary .notification');
  leftSideStat.forEach((leftStat, idx) => {
    const rightStat = rightSideStat[idx];

    const rightStatValue = rightStat.dataset.value;
    const leftStatVlaue = leftStat.dataset.value;

    if (leftStatVlaue > rightStatValue) {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    } else {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    }
  })
}

const movieTemplate = movieDetail => {
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/, '').replace(/,/, ''));
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes);

  return `
  <article class="media">
  <figure class="media-left">
    <p class="image">
      <img src="${movieDetail.Poster}" alt="">
    </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <h1>${movieDetail.Title}</h1>
      <h4>${movieDetail.Genre}</h4>
      <p>${movieDetail.Plot}</p>
    </div>
  </div>
  </article>
  <article data-value=${awards} class='notification is-primary'>
    <p class='title'>${movieDetail.Awards}</p>
    <p class='subtitle'>Awards</p>
  </article>
  <article data-value=${dollars} class='notification is-primary'>
  <p class='title'>${movieDetail.BoxOffice}</p>
  <p class='subtitle'>Box office</p>
  </article>
  <article data-value=${metascore} class='notification is-primary'>
  <p class='title'>${movieDetail.Metascore}</p>
  <p class='subtitle'>Metascore</p>
  </article>
  <article data-value=${imdbRating} class='notification is-primary'>
  <p class='title'>${movieDetail.imdbRating}</p>
  <p class='subtitle'>IMDB rating</p>
  </article>
  <article data-value=${imdbVotes} class='notification is-primary'>
  <p class='title'>${movieDetail.imdbVotes}</p>
  <p class='subtitle'>IMDB votes</p>
  </article>

  `;
};