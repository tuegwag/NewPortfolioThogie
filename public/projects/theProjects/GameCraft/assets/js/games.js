const cards = document.querySelectorAll('.gameCard');
const leftBtn = document.querySelector('.leftBtn');
const rightBtn = document.querySelector('.rightBtn');
let currentIndex = 1;

function updateCarousel() {
    cards.forEach(function (card, index) {
        card.className = 'gameCard';

        const leftIndex = (currentIndex - 1 + cards.length) % cards.length;
        const rightIndex = (currentIndex + 1) % cards.length;

        if (index === currentIndex) {
            card.classList.add('active');
        } else if (index === leftIndex) {
            card.classList.add('left');
        } else if (index === rightIndex) {
            card.classList.add('right');
        } else {
            card.classList.add('hidden');
        }
    });
}

leftBtn.addEventListener('click', function () {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = cards.length - 1;
    }
    updateCarousel();
});

rightBtn.addEventListener('click', function () {
    currentIndex++;
    if (currentIndex >= cards.length) {
        currentIndex = 0;
    }
    updateCarousel();
});

// Hamburger menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');


if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        navLinks.classList.toggle('active');
    });
} 

if (navLinks) {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

updateCarousel();