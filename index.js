const searchInput = document.getElementById('searchInput');
const search = document.getElementById('search');

const fetchNews = async (page, q) => {
  if (!q) {
    console.error("Please provide a search query.");
    return;
  }

  console.log(`Fetching News! for ${q}, Page no. ${page}`);

  const today = new Date().toISOString().split('T')[0]; // Get today's date
  const pastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Get the date from a week ago

  const url = `https://newsapi.org/v2/everything?q=${q}&from=${pastWeek}&to=${today}&pageSize=20&page=${page}&sortBy=popularity&apiKey=991b2bb6f28d475e9e01f0519bbd958e`;

  const req = new Request(url);

  try {
    const response = await fetch(req);
    const data = await response.json();
    console.log(data);

    if (!data.articles || !Array.isArray(data.articles)) {
      console.error("Invalid articles data returned from the API:", data);
      return;
    }

    displayArticles(data.articles);
  } 
  catch (error) {
    console.error("Error fetching news:", error);
  }
}

const displayArticles = (articles) => {
  let str = "";
  if (!Array.isArray(articles)) {
    console.error("Articles data is not in the expected format.");
    return;
  }

  for (let article of articles) {
    const imageUrl = article.urlToImage ? article.urlToImage : 'placeholder_image_url';

    str += `<div class="card m-auto" style="width: 18rem;">
              <img src="${imageUrl}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">${article.title}</h5>
                <p class="card-text">${article.description}</p>
                <a href="${article.url}" target="_blank" class="btn btn-primary">Read more</a>
              </div>
            </div>`;
  }

  document.querySelector(".content").innerHTML = str;
}

let currentPage = 1;
let currentQuery = "";
const prev = document.getElementById('prev');
const next = document.getElementById('next');

search.addEventListener("click", async (e) => {
  e.preventDefault();
  let query = searchInput.value;
  if(query){
    currentPage = 1;
    currentQuery = query;
    await fetchNews(1, query);
  }
  else {
    console.error("Please enter a valid search query.");
  }
});

prev.addEventListener("click", async (e) => {
  e.preventDefault();
  let query = searchInput.value;
  if(query && currentPage > 1){
    currentPage -= 1;
    await fetchNews(currentPage, query);
  }
  else {
    console.error("Invalid query or page number.");
  }
});

next.addEventListener("click", async (e) => {
  e.preventDefault();
  const query = currentQuery.trim();
  if(query){
    currentPage += 1;
    await fetchNews(currentPage, query);
  }
  else{
    console.error("Invalid Error");
  }
});

window.onload = async () => {
  await fetchNews(1, "Headlines");
};

fetchNews(1, currentQuery);