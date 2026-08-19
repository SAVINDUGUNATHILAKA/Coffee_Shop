const searchIcon = document.querySelector('#search-icon');
const searchBox = document.querySelector('.search-box');
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

// Toggle Search Box on Click
if (searchIcon && searchBox) {
    searchIcon.onclick = (e) => {
        e.stopPropagation();
        searchBox.classList.toggle('active');
        if (navbar) navbar.classList.remove('active');
    };
}

// Toggle Mobile Navbar on Click
if (menuIcon && navbar) {
    menuIcon.onclick = (e) => {
        e.stopPropagation();
        navbar.classList.toggle('active');
        if (searchBox) searchBox.classList.remove('active');
    };
}

// Close search box and navbar on scroll or click outside
window.onscroll = () => {
    if (navbar) navbar.classList.remove('active');
    if (searchBox) searchBox.classList.remove('active');
};

document.onclick = (e) => {
    if (searchBox && !searchBox.contains(e.target) && e.target !== searchIcon) {
        searchBox.classList.remove('active');
    }
};