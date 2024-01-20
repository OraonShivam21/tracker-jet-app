// public/scripts.js

document.addEventListener('DOMContentLoaded', function () {
  const quoteContainer = document.getElementById('quote-container');
  const paginationContainer = document.getElementById('pagination-container');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const quotesPerPage = 4;
  let currentPage = 1;

  function fetchAndDisplayQuotes(page) {
    fetch(`http://localhost:3000/quote/?page=${page}&limit=${quotesPerPage}`)
      .then(response => response.json())
      .then(data => {
        const quotes = data.quotes;

        if (quotes.length > 0) {
          quoteContainer.innerHTML = '';

          quotes.forEach(quote => {
            const quoteElement = document.createElement('div');
            quoteElement.classList.add('quote');
            quoteElement.innerHTML = `
              <blockquote>
                <p>"${quote.text}"</p>
                ${quote.author ? `<footer><cite>~${quote.author}</cite></footer>` : ''}
              </blockquote>
            `;
            quoteContainer.appendChild(quoteElement);
          });

          paginationContainer.style.display = 'block';
          updatePaginationButtons(data.pagination);
        } else {
          quoteContainer.innerHTML = '<p>No quotes available.</p>';
          paginationContainer.style.display = 'none';
        }
      })
      .catch(error => console.error('Error fetching quotes:', error));
  }

  function loadNextPage() {
    currentPage++;
    fetchAndDisplayQuotes(currentPage);
  }

  function loadPrevPage() {
    if (currentPage > 1) {
      currentPage--;
      fetchAndDisplayQuotes(currentPage);
    }
  }

  function updatePaginationButtons(pagination) {
    if (pagination && pagination.prev) {
      prevButton.disabled = true;
    } else {
      prevButton.disabled = false;
    }

    if (pagination && pagination.next) {
      nextButton.disabled = false;
    } else {
      nextButton.disabled = true;
    }
  }

  prevButton.addEventListener('click', loadPrevPage);
  nextButton.addEventListener('click', loadNextPage);

  // Initial load
  fetchAndDisplayQuotes(currentPage);
});

let playButton = document.getElementById("playButton");
let palyLink = document.getElementById("playLink");
let Video_div = document.getElementsByClassName("Video_div");
let gridVideo = document.getElementsByClassName("gridVideo");
let videoImage = document.getElementById("videoImage");

videoImage.addEventListener("click", (e) => {
  playButton.style.display = "none";

  videoImage.style.display = "none";
  let newIframe = document.createElement("iframe");
  newIframe.className = "gridVideo";
  newIframe.width = "100%";
  newIframe.height = "100%";
  newIframe.src = "https://www.youtube.com/embed/rXcp6s0VjZk";
  newIframe.allowFullscreen = true;
  let videoDiv = document.querySelector(".Video_div");
  videoDiv.appendChild(newIframe);
});
// videoImage.addEventListener("click", (e) => {
//   playButton.style.display = "none";

//   videoImage.style.display = "none";
//   let newIframe = document.createElement("iframe");
//   newIframe.className = "gridVideo";
//   newIframe.width = "100%";
//   newIframe.height = "100%";
//   newIframe.src = "https://youtu.be/W0DM5lcj6mw?si=NyVPZbtFMevpOdyQ";
//   newIframe.allowFullscreen = true;
//   let videoDiv = document.querySelector(".Video_div");
//   videoDiv.appendChild(newIframe);
// });