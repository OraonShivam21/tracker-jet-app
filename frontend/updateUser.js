document.addEventListener('DOMContentLoaded', () => {
    // Retrieve user details from local storage
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    
    console.log(name)
    // if (name) {
    //     const user = JSON.parse(storedUser);

        // Populate the form fields with user details
        document.getElementById('updateName').value = name;
        document.getElementById('updateEmail').value = email;
        
        // Show the update profile form
        // document.getElementById('updateProfileForm').style.display = 'block';
    
});
const tasks = localStorage.getItem("tasks");
document.getElementById("tasksCount").innerText=`Total Task : ${tasks}`;


// Function to open the update form

    // document.getElementById('updateName').value = user.name;
    // document.getElementById('updateEmail').value = user.email;
    // document.getElementById('updateForm').style.display = 'block';
    // document.getElementById('userDetails').style.display = 'none';

// Function to update user profile
const userID = localStorage.getItem('userID');
async function updateUserProfile() {
    const updateName = document.getElementById('updateName').value;
    const updateEmail = document.getElementById('updateEmail').value;

    try {
        const response = await fetch(`http://localhost:3000/user/update/${userID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: updateName, email: updateEmail }),
        });

        const data = await response.json();
        document.getElementById("updated").innerText = 'Updated Successful !'

        // Update the UI with new user details
        // document.getElementById('userName').textContent = updateName;
        // document.getElementById('userEmail').textContent = updateEmail;
        localStorage.setItem('name', updateName);
        // alert("update Sccessful !")
        window.location.href = './dashboard/dashboard.html'
        
    } catch (error) {
        console.error('Error updating profile:', error);
    }
}