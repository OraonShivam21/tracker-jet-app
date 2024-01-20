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
    body: JSON.stringify({ title, status: false }),
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
      console.log(data.tasks);
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
  tasks.forEach((task) => {
    myDayTasksContent.appendChild(createMyDayTaskCard(task));
  });

  const taskCards = document.getElementsByClassName("task-card");
  const checkedTasks = document.getElementsByClassName("task-card-checkbox");
  for (let i = 0; i < checkedTasks.length; i++) {
    checkedTasks[i].addEventListener("click", (e) => {
      taskCards[i].classList.toggle("task-completed");
    });
  }
}

function createMyDayTaskCard(task) {
  const taskCard = document.createElement("div");
  taskCard.setAttribute("class", "task-card");

  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("name", "task-card-checkbox");
  input.setAttribute("class", "task-card-checkbox");
  input.setAttribute("id", task._id);
  taskCard.appendChild(input);

  const label = document.createElement("label");
  label.setAttribute("for", task._id);
  const taskCardHeading = document.createElement("div");
  taskCardHeading.setAttribute("class", "task-card-heading");
  taskCardHeading.innerText = "My-Task";

  const spanMaterial = document.createElement("span");
  spanMaterial.setAttribute("class", "material-symbols-outlined");
  spanMaterial.innerText = " chevron_right ";
  taskCardHeading.appendChild(spanMaterial);

  const spanCategory = document.createElement("span");
  spanCategory.innerText = task.category;
  taskCardHeading.appendChild(spanCategory);

  label.appendChild(taskCardHeading);

  const h5Title = document.createElement("h5");
  h5Title.setAttribute("class", "title");
  h5Title.innerText = task.title;
  label.appendChild(h5Title);

  taskCard.appendChild(label);

  return taskCard;
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
