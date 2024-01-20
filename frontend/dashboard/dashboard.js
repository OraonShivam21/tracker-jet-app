const menuItems = document.getElementsByClassName("menu-item");
const dashboardContentNavs = document.getElementsByClassName(
  "dashboard-content-nav"
);

// localStorage.setItem("name", "Shivam");
// localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWE3ZGRmNWFjZjA1OTdlYjQzY2QxYTQiLCJ1c2VyIjoiU2hpdmFtIiwiaWF0IjoxNzA1NzQ3OTc2fQ.yB5gz7MsY9oRdtVlLuC8erFUYVwbMYxIT2oNqZNaINo")

const token = localStorage.getItem("token");

window.addEventListener("load", (e) => {
  const timeNow = new Date().getHours();
  const greeting = document.getElementById("greeting");

  if (timeNow >= 0 && timeNow < 12) {
    greeting.innerText = "Good Morning";
  } else if (timeNow >= 12 && timeNow < 20) {
    greeting.innerText = "Good Evening";
  } else {
    greeting.innerText = "Good Night";
  }

  const username = localStorage.getItem("name");
  const sidebarUsername = document.getElementById("username");
  const headingUsername = document.getElementById("heading-username");
  if (username) {
    sidebarUsername.innerText = username;
    sidebarUsername.style.textTransform = "capitalize";
    headingUsername.innerText = username;
    headingUsername.style.textTransform = "capitalize";
  }

  menuItems[0].classList.add("active");
  dashboardContentNavs[0].classList.add("active");

  fetchAndShowMyDayTask();
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

const addMyDayTaskBtn = document.getElementById("add-my-day-task-btn");
const addMyDayTask = document.getElementById("addMyDayTask");

addMyDayTask.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addMyDayNewTask();
});

function addMyDayNewTask() {
  const taskAddURL = "http://localhost:3000/tasks/add";
  const title = addMyDayTask.value;
  fetch(taskAddURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) throw data.error;
      console.log(data.msg);
      fetchAndShowMyDayTask();
    })
    .catch((error) => console.log(error));
}

const myDayTasksContent = document.getElementById("my-day-tasks-content");

function fetchAndShowMyDayTask() {
  const getTasksURL = "http://localhost:3000/tasks";

  fetch(getTasksURL, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) throw data.error;
      renderMyDayTasks(data.tasks);
    })
    .catch((error) => {
      console.log(error);
      myDayTasksContent.style.position = "absolute";
      myDayTasksContent.style.bottom = "6rem";
      myDayTasksContent.style.opacity = ".7";
      myDayTasksContent.innerText = error;
    });
}

function renderMyDayTasks(tasks) {
  myDayTasksContent.innerHTML = null;
  tasks.forEach(task => {
    myDayTasksContent.appendChild(createMyDayTaskCard(task));
  });
}

function createMyDayTaskCard(task) {
  
}

const logoutButton = document.getElementById("logoutBTN");
logoutButton.addEventListener("click", (e) => {
  e.preventDefault();
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
