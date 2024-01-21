const signUpBtn = document.getElementById('rsbtn');
const firstNameInputs = document.getElementById('fname');
const emailInputs = document.getElementById('remail');
const passwordInputs = document.getElementById('rpswd');
const emailLogin = document.getElementById("email");
const passLogin = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn")

document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.getElementById('signupForm');
  const otpVerificationForm = document.getElementById('otpVerificationForm');
  const verifyOtpBtn = document.getElementById('verifyOtpBtn');

  signUpBtn.addEventListener('click', function (event) {
      event.preventDefault();

      // Hide signup form, show OTP verification form
      signupForm.style.display = 'none';
      otpVerificationForm.style.display = 'block';

  });
});


// #################3
const form = document.getElementById("signupForm");
    form.addEventListener("submit",(e)=>{
        e.preventDefault();
    })
    const registerUser=()=>{
    
    fetch("https://tracker-jet-api.onrender.com/user/register",{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify({
            name:firstNameInputs.value,
            email:emailInputs.value,
            password:passwordInputs.value
        })
    }).then((res) => res.json())
    .then((data) => {
      console.log(data);
      localStorage.setItem('user', JSON.stringify(data.user.name))

    })
    .catch((err) => console.log(err));
}


const form2 = document.getElementById("otpVerificationForm");
form2.addEventListener("submit", async(e) => {
    e.preventDefault();
});


const verifyUser = () => {
     fetch("https://tracker-jet-api.onrender.com/user/verifyOTP", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                email:document.getElementById("emailverify").value,
                otp: document.getElementById("otp").value,
            }),
        })
        .then(res=>res.json())
        .then(data =>{
            if(data.msg === 'User email verified successfully'){
                document.getElementById("msgDisplay").innerText="Verification Successful 😊!"
                // alert("Verified")
            }else{
                console.log(data.msg);
                document.getElementById("msgDisplay").innerText="Wrong OTP, Try Again !"
                // alert("Wrong otp")
            }
        })
    }


const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
});
const logbtn = document.getElementById("loginBtn");

logbtn.addEventListener("click", async (e) => {
e.preventDefault();
// if(!emailLogin.value || passLogin.value){
//     document.getElementById("msgDisplayTag").innerText = "Empty Field !"
// }else{
try {
    const response = await fetch("https://tracker-jet-api.onrender.com/user/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            email: emailLogin.value,
            password: passLogin.value,
        }),
    });
    
    if (!response.ok) {
        document.getElementById("msgDisplayTag").innerText = "Wrong Email or Password"
        throw new Error(`Login failed: ${response.statusText}`);
        
    }else{

    const data = await response.json();
    console.log(data);

    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.user.name);
    location.href = "../dashboard/dashboard.html";
    }
} catch (err) {
    console.log(err.message);
}
});



















// signBtn.addEventListener('click', () => {
//     const userObj = {
//         firstName: firstNameInput.value,
//         lastName: lastNameInput.value,
//         email: emailInput.value,
//         phone: parseInt(phoneInput.value),
//         dateOfBirth: dateOfBirthInput.value,
//         password: passwordInput.value
//     };

//     if (validatePassword(userObj.password)) {
//         registerUser(userObj);
//     } else {
//         alert('Password must contain at least 6 characters');
//     }
// });

// async function registerUser(userObj) {
//     console.log('User Object:', userObj);

//     try {
//         const res = await fetch(userUrl, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(userObj),
//         });

//         if (!res.ok) {
//             throw new Error(`Registration failed. Status: ${res.status}`);
//         }

//         const data = await res.json();
//         console.log(data);
//         successfullyRegistered();

//     } catch (error) {
//         console.error('Error during registration:', error);
//         if (error.response) {
//             console.error('Response text:', await error.response.text());
//         }
//         alert('Registration failed. Please check the console for details.');
//     }
// }

// function successfullyRegistered() {
//     alert("Registration successful! Please log in to continue.");
// }

// function validatePassword(password) {
//     return password.length >= 6;
// }



// async function fetchData(url) {
//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         console.log(data);

//         return data;

//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }
// fetchData(userUrl);
// async function validateLogin() {
//     const emailInput = document.getElementById("email").value;
//     const passwordInput = document.getElementById("password").value;
    
//     const userData = await fetchData(userUrl);
    
// console.log(passwordInput);

//     console.log('Email Input:', emailInput);
//     console.log('Password Input:', passwordInput);

//     const user = userData.find(user => user.email === emailInput && user.password === passwordInput);

//     if (user) {
//         window.location.href = "index.html";
//     } else {
//         alert("Incorrect email or password. Please try again.");
//     }
// }
// document.addEventListener('DOMContentLoaded', function () {
//     const sign = document.querySelector('.rbutton1');
//     sign.addEventListener('click', validateLogin);
// });