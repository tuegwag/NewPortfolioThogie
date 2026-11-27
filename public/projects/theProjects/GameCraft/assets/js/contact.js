// Submit button validation
const form = document.querySelector("form");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // voorkomt refresh

  // Check of alle required velden zijn ingevuld
  const firstName = document.querySelector('input[placeholder="first name"]');
  const lastName = document.querySelector('input[placeholder="last name"]');
  const email = document.querySelector('input[type="email"]');
  const message = document.querySelector('textarea[name="message"]');

  if (
    firstName.value.trim() === "" ||
    lastName.value.trim() === "" ||
    email.value.trim() === "" ||
    message.value.trim() === ""
  ) {
    alert("Please fill in all required fields before submitting.");
    return;
  }

  alert("Thank you for contacting us! We will contact you back as soon as possible.");
  form.reset(); //reset formulier
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  console.log('DOM Loaded');
  console.log('mobileMenuBtn:', mobileMenuBtn);
  console.log('navLinks:', navLinks);

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.onclick = function (e) {
      console.log('Button onclick triggered!');
      navLinks.classList.toggle('active');
      console.log('Classes after toggle:', navLinks.classList);
    };
    mobileMenuBtn.addEventListener('click', function (e) {
      console.log('Button click event listener triggered!');
      navLinks.classList.toggle('active');
      console.log('Classes after toggle:', navLinks.classList);
    });
  } else {
    console.log('Button or nav not found!');
  }

  // Close menu when clicking on a link
  if (navLinks) {
    const navLinks_temp = navLinks; // Capture in closure
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        console.log('Nav link clicked');
        navLinks_temp.classList.remove('active');
      });
    });
  }

  // Close menu when clicking outside
  if (navLinks) {
    document.addEventListener('click', (e) => {
      const isClickInsideNav = navLinks.contains(e.target);
      const isClickOnButton = e.target.closest('.mobile-menu-btn');

      if (!isClickInsideNav && !isClickOnButton) {
        navLinks.classList.remove('active');
      }
    });
  }
});
const btn = document.getElementById("mobileMenuBtn");
const nav = document.getElementById("navLinks");

btn.addEventListener("click", () => {
    nav.classList.toggle("open");
});

