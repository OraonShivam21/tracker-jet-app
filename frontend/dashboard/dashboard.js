const logoutButton = document.getElementById("logoutBTN");
logoutButton.addEventListener('click', (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");
    console.log(token)
    
    fetch("http://localhost:3000/user/logout", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        
    })
    .then((response) => {
        if (response.ok) {
            localStorage.removeItem("token")
            return response.json();
            
        } else {
            throw new Error(`Logout failed: ${response.statusText}`);
        }
    })
    .then((result) => {
        console.log(result.msg); 
        location.href = '../index.html';
    })
    .catch((error) => {
        console.error(error);
    });
});