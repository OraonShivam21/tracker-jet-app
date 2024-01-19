document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar.offsetHeight;

    window.addEventListener("scroll", function () {
        if (window.scrollY > navbarHeight) {
            navbar.classList.add("navbar-scrolled");
        } else {
            navbar.classList.remove("navbar-scrolled");
        }
    });
});