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

  if (timeNow >= 6 && timeNow < 12) {
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

  if (dashboardContentID === "discussionForum")
    location.replace("../discussion/dashboard.html");

  for (var i = 0; i < dashboardContentNavs.length; i++) {
    dashboardContentNavs[i].classList.remove("active");
  }
  document.getElementById(dashboardContentID).classList.add("active");

  if (dashboardContentID === "personal-list-section")
    fetchAndShowPersonalTask();
  else if (dashboardContentID === "work-list-section") fetchAndShowWorkTask();
  else if (dashboardContentID === "assignment-list-section")
    fetchAndShowAssignmentTask();
  else fetchAndShowMyDayTask();
}

const addMyDayTask = document.getElementById("addMyDayTask");
const addAllMyTask = document.getElementById("addAllMyTask");
const personalTask = document.getElementById("personalTask");
const workTask = document.getElementById("workTask");
const assignmentTask = document.getElementById("assignmentTask");

addMyDayTask.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addMyDayNewTask(1);
});

addAllMyTask.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addMyDayNewTask(2);
});

personalTask.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addMyDayNewTask(3);
});

workTask.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addMyDayNewTask(4);
});

assignmentTask.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addMyDayNewTask(5);
});

function addMyDayNewTask(num) {
  const taskAddURL = "http://localhost:3000/tasks/add";
  let payload = {
    title: "",
    category: "",
    status: false,
  };
  if (num === 1 || num === 2) {
    payload.title = num === 1 ? addMyDayTask.value : addAllMyTask.value;
    payload.category = "personal";
  } else if (num === 3) {
    payload.title = personalTask.value;
    payload.category = "personal";
  } else if (num === 4) {
    payload.title = workTask.value;
    payload.category = "work";
  } else if (num === 5) {
    payload.title = assignmentTask.value;
    payload.category = "assignment";
  }
  fetch(taskAddURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // body: JSON.stringify({ title, status: false })
    body: JSON.stringify(payload),
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
const allMyTasksContent = document.getElementById("all-my-tasks-content");
const personalTasksContent = document.getElementById("personal-tasks-content");
const workTasksContent = document.getElementById("work-tasks-content");
const assignmentTasksContent = document.getElementById(
  "assignment-tasks-content"
);

function fetchAndShowMyDayTask() {
  const getTasksURL = `http://localhost:3000/tasks`;

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
      const totalTasks = data.tasks.length;
      console.log(totalTasks);
      document.getElementById("my-day-badge").innerText = totalTasks;
      document.getElementById("all-tasks-badge").innerText = totalTasks;
      document.getElementById("calender-badge").innerText = totalTasks;
      renderMyDayTasks(data.tasks, 1);
    })
    .catch((error) => {
      console.log(error);
    });
}

function fetchAndShowPersonalTask() {
  const getTasksURL = `http://localhost:3000/tasks?category=personal`;

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
      document.getElementById("personal-badge").innerText = data.tasks.length;
      renderMyDayTasks(data.tasks, 2);
    })
    .catch((error) => {
      console.log(error);
    });
}

function fetchAndShowWorkTask() {
  const getTasksURL = `http://localhost:3000/tasks?category=work`;

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
      document.getElementById("work-badge").innerText = data.tasks.length;
      renderMyDayTasks(data.tasks, 3);
    })
    .catch((error) => {
      console.log(error);
    });
}

function fetchAndShowAssignmentTask() {
  const getTasksURL = `http://localhost:3000/tasks?category=assignment`;

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
      document.getElementById("assignment-badge").innerText = data.tasks.length;
      renderMyDayTasks(data.tasks, 4);
    })
    .catch((error) => {
      console.log(error);
    });
}

function renderMyDayTasks(tasks, num) {
  myDayTasksContent.innerHTML = null;
  allMyTasksContent.innerHTML = null;
  personalTasksContent.innerHTML = null;
  workTasksContent.innerHTML = null;
  assignmentTasksContent.innerHTML = null;
  tasks.forEach((task) => {
    if (num === 1) {
      myDayTasksContent.appendChild(createMyDayTaskCard(task));
      allMyTasksContent.appendChild(createMyDayTaskCard(task));
    } else if (num === 2)
      personalTasksContent.appendChild(createMyDayTaskCard(task));
    else if (num === 3) workTasksContent.appendChild(createMyDayTaskCard(task));
    else if (num === 4)
      assignmentTasksContent.appendChild(createMyDayTaskCard(task));
  });

  const taskCards = document.getElementsByClassName("task-card");
  const checkedTasks = document.getElementsByClassName("task-card-checkbox");
  for (let i = 0; i < checkedTasks.length; i++) {
    checkedTasks[i].addEventListener("click", (e) => {
      console.log(e.target.id);
      taskCards[i].classList.toggle("task-completed");
      fetch(`http://localhost:3000/tasks/update/${e.target.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: true }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.msg);
          if (num === 1) fetchAndShowMyDayTask();
          else if (num === 2) fetchAndShowPersonalTask();
          else if (num === 3) fetchAndShowWorkTask();
          else if (num === 4) fetchAndShowAssignmentTask();
        })
        .catch((error) => console.error(error));
    });
  }
}

function createMyDayTaskCard(task) {
  const taskCard = document.createElement("div");
  taskCard.setAttribute("class", "task-card");

  if (task.status) taskCard.classList.add("task-completed");

  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("name", "task-card-checkbox");
  input.setAttribute("class", "task-card-checkbox");
  input.setAttribute("id", task._id);
  if (task.status) input.checked = true;
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
