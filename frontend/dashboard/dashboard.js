const menuItems = document.getElementsByClassName("menu-item");
const dashboardContentNavs = document.getElementsByClassName(
  "dashboard-content-nav"
);

window.addEventListener("load", (e) => {
  const username = localStorage.getItem("name");
  if (username) {
    document.getElementById("username").innerText = username;
    document.getElementById("username").style.textDecoration = "uppercase";
  }

  menuItems[0].classList.add("active");
  dashboardContentNavs[0].classList.add("active");
});

function menuItemClicked(menuItem, dashboardContentID) {
  for (var i = 0; i < menuItems.length; i++) {
    menuItems[i].classList.remove("active");
  }
  menuItem.classList.add("active");

  for (var i = 0; i < dashboardContentNavs.length; i++) {
    dashboardContentNavs[i].classList.remove("active");
  }
  document.getElementById(dashboardContentID).classList.add("active");
}

const logoutButton = document.getElementById("logoutBTN");
logoutButton.addEventListener("click", (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  console.log(token);

  fetch("http://localhost:3000/user/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        localStorage.removeItem("token");
        return response.json();
      } else {
        throw new Error(`Logout failed: ${response.statusText}`);
      }
    })
    .then((result) => {
      console.log(result.msg);
      location.href = "../index.html";
    })
    .catch((error) => {
      console.error(error);
    });
});
