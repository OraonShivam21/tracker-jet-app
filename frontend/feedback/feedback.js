// localStorage.setItem("name", "Shivam");
// localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWE3ZGRmNWFjZjA1OTdlYjQzY2QxYTQiLCJ1c2VyIjoiU2hpdmFtIiwidXNlcm5hbWUiOiJTaGl2YW0iLCJpYXQiOjE3MDU4MzQzOTh9.puU1Zk97coWE5arBOr1IXJ5o-g4rDk2o_SUdgLYziCQ");

window.addEventListener("load", (e) => {
  fetchFeedbackAndRender();
});

const feedbackPerPage = 10;
let currentPage = 1;
let totalFeedback = 0;

function fetchFeedbackAndRender() {
  console.log("fetch and show data");
  fetch(`http://localhost:3000/feedback?page=${currentPage}&limit=${feedbackPerPage}`)
    .then((res) => {
      totalFeedback = res.headers.get("X-Total-Count");
      return res.json();
    })
    .then((data) => {
      console.log(data.feedbacks);
      createAndRenderFeedbackCard(data.feedbacks);
      if (totalFeedback > 10) renderPaginationButton();
    })
    .catch((error) => console.log(error));
}

const showFeedback = document.getElementById("show-feedback");

function createAndRenderFeedbackCard(feedbacks) {
  showFeedback.innerHTML = null;
  feedbacks.forEach((feedback) => {
    showFeedback.appendChild(createFeedbackCard(feedback));
  });
}

function createFeedbackCard(feedback) {
  const feedbackCard = document.createElement("div");
  feedbackCard.setAttribute("class", "feedback-card");

  const user = document.createElement("div");
  user.setAttribute("class", "feedback-card-user");

  const img = document.createElement("p");
  img.setAttribute("class", "feedback-card-user-img");
  img.innerText = feedback.user.substring(0, 2);
  user.appendChild(img);

  const name = document.createElement("p");
  name.setAttribute("class", "feedback-card-user-name");
  name.innerText = feedback.user;
  user.appendChild(name);

  const content = document.createElement("div");
  content.setAttribute("class", "feedback-card-content");

  const title = document.createElement("h5");
  title.setAttribute("class", "feedback-card-title");
  title.innerText = feedback.title;
  content.appendChild(title);

  const body = document.createElement("p");
  title.setAttribute("class", "feedback-card-body");
  title.innerText = feedback.body;
  content.appendChild(body);

  const rating = document.createElement("div");
  rating.setAttribute("class", "feedback-rating");
  rating.innerHTML = `${feedback.rating} &star;`;

  feedbackCard.appendChild(user);
  feedbackCard.appendChild(content);
  feedbackCard.appendChild(rating);

  return feedbackCard;
}

function renderPaginationButton() {
  const showPageBtns = document.getElementById("show-page-btns");
  const totalBtns = Math.ceil(totalFeedback / feedbackPerPage);
  showPageBtns.innerHTML = null;

  for (let i = 1; i <= totalBtns; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.addEventListener("click", () => {
      currentPage = i;
      fetchFeedbackAndRender();
    });
    showPageBtns.appendChild(button);
  }
}
