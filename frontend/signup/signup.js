const signUpBtn = document.getElementById('rsbtn');
const firstNameInputs = document.getElementById('fname');
const emailInputs = document.getElementById('remail');
const passwordInputs = document.getElementById('rpswd');
const emailLogin = document.getElementById("email");
const passLoin = document.getElementById("password");

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

  verifyOtpBtn.addEventListener('click', function () {
      // Perform OTP verification logic here
      // If verification is successful, you can redirect or take further actions
      alert('OTP verified. Redirecting to login or other actions.');
  });
});


// #################3
const form = document.getElementById("signupForm");
    form.addEventListener("submit",(e)=>{
        e.preventDefault();
    })
    const registerUser=()=>{
    
    fetch("http://localhost:3000/user/register",{
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
    form2.addEventListener("submit",(e)=>{
        e.preventDefault();
    })


    const verifyUser=()=>{
    
      fetch("http://localhost:3000/user/verifyOTP",{
          method:"POST",
          headers:{
              "Content-type":"application/json"
          },
          body:JSON.stringify({
              name:document.getElementById("otp").value
          })
      }).then((res) => res.json())
      .then((data) => {
        console.log(data);
        // localStorage.setItem('user', JSON.stringify(data.user.name))
        
  
      })
      .catch((err) => console.log(err));
  }


















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