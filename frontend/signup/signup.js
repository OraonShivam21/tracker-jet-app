const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});


$("#search-icon").click(function() {
  $(".nav").toggleClass("search");
  $(".nav").toggleClass("no-search");
  $(".search-input").toggleClass("search-active");
});

$('.menu-toggle').click(function(){
   $(".nav").toggleClass("mobile-nav");
   $(this).toggleClass("is-active");
});
const signUpBtn = document.getElementById('signUPBTN');
signUpBtn.addEventListener('click', function (event) {
  event.preventDefault(); // Prevent form submission
   location.replace("../navbar/navbar.html")
  // container.classList.add('blur');
  // otpVerification.style.display = 'block';
});
// document.addEventListener('DOMContentLoaded', function () {
 
//   const otpVerification = document.getElementById('otpVerification');
//   const verifyOtpBtn = document.getElementById('verifyOtpBtn');

  

//   verifyOtpBtn.addEventListener('click', function () {
//     // Perform OTP verification logic here
//     // If verification is successful, show login form
//     alert('OTP verified. Login form will appear.');

//     // Optional: Reset the form and remove the blur
//     otpVerification.style.display = 'none';
//     container.classList.remove('blur');
//   });
// });

  // sign_in_btn.addEventListener('click', function () {
  //   container.classList.remove('blur');
  //   otpVerification.style.display = 'none';
  // });




// Login / Signup functionality

