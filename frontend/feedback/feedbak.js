const parent = document.getElementById("container1");

const header1 = document.getElementById("header");
header1.innerText = `Hello ${localStorage.getItem("name")}!`;
parent.append(header1);

const Welcome = document.getElementById("Welcome");
Welcome.innerText = "Welcome to SwiftNote";
parent.append(Welcome);

const addNoteDiv = document.getElementById("add-note");

addNoteDiv.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(
      "http://localhost:3000/feedback/add",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: document.getElementById("n-title").value,
          body: document.getElementById("n-body").value,
        }),
      }
    );
    if (!response.ok) {
      window.alert("please enter right credintials");
      throw new Error(`Registration failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    window.location.reload();
  } catch (err) {
    console.log(err.message);
  }
});


function getData() {
  fetch("https://note-app-2fp7.onrender.com/notes", {
    headers: {
      "Content-type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data.notes_data);
      displayNotes(data);
    })
    .catch((err) => console.log(err));
}

function displayNotes(data) {
  const noteList = document.getElementById("note-card-list");
  const notes = data.notes_data;

  notes.forEach((note) => {
    const noteCard = document.createElement("div");
    noteCard.classList.add("note-card");

    const title = document.createElement("h3");
    title.innerText = note.title;

    const content = document.createElement("p");
    content.innerText = note.body;

    const editBtn = document.createElement("button");
    editBtn.className = "btn1";
    editBtn.innerText = "Edit";
    editBtn.addEventListener("click", () => {
        openEditModal(note._id, note.title, note.body);
      });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn1";
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", () => {
        deleteNote(note._id)
    });

    noteCard.append(title, content, editBtn, deleteBtn);
    

    noteList.appendChild(noteCard);
  });
}

getData();

function openEditModal(noteId, currentTitle, currentBody) {
    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");
  
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = currentTitle;
    titleInput.placeholder = "Note Title";
    titleInput.classList.add("edit-input");
  
    const bodyTextarea = document.createElement("textarea");
    bodyTextarea.value = currentBody;
    bodyTextarea.placeholder = "Note Body";
    bodyTextarea.classList.add("edit-input");
  
    const updateBtn = document.createElement("button");
    updateBtn.type = "button";
    updateBtn.innerText = "Update";
    updateBtn.classList.add("btn1");
  
    popupContainer.appendChild(titleInput);
    popupContainer.appendChild(bodyTextarea);
    popupContainer.appendChild(updateBtn);
  
    showModal(popupContainer);
  
    updateBtn.addEventListener("click", async () => {
      try {
        const response = await fetch(
          `https://note-app-2fp7.onrender.com/notes/update/${noteId}`,
          {
            method: "PATCH",
            headers: {
              "Content-type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              title: titleInput.value,
              body: bodyTextarea.value,
            }),
          }
        );
  
        if (!response.ok) {
          throw new Error(`Note update failed: ${response.statusText}`);
        }
  
        const updatedData = await response.json();
        console.log(updatedData);
  
        hideModal();

        getData();
        window.location.reload();
      } catch (err) {
        console.log(err.message);
      }
    });
  }
function showModal(content) {
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");
  
    const modalBackdrop = document.createElement("div");
    modalBackdrop.classList.add("modal-backdrop");
  
    modalContainer.appendChild(content);
  
    document.body.appendChild(modalBackdrop);
    document.body.appendChild(modalContainer);
  
    modalBackdrop.addEventListener("click", hideModal);
  }
  
  function hideModal() {
    const modalContainer = document.querySelector(".modal-container");
    const modalBackdrop = document.querySelector(".modal-backdrop");
  
    if (modalContainer) {
      modalContainer.remove();
    }
  
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }
  async function deleteNote(noteId) {
    try {
      const response = await fetch(
        `https://note-app-2fp7.onrender.com/notes/delete/${noteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Note deletion failed: ${response.statusText}`);
      }
  
      const deletedData = await response.json();
      console.log(deletedData);
  
      getData();
      window.location.reload();

    } catch (err) {
      console.log(err.message);
    }
  }
  
  const logoutbtn = document.getElementById('logoutbtn');
  logoutbtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
          const response = await fetch('https://note-app-2fp7.onrender.com/users/logout', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
            //   credentials: 'include', // Send cookies with the request
            //   body: JSON.stringify({
            //       access_token: localStorage.getItem('token'),
            //       refresh_token: localStorage.getItem('token2'),
            //   }),
          });
  
          if (response.ok) {
              const result = await response.json();
              console.log(result.msg); // Display the success message
              // Redirect or perform any other action after successful logout
              location.href = '/index.html';
          } else {
              const error = await response.json();
              console.error(error.error);
          }
      } catch (error) {
          console.error(error);
      }
  });