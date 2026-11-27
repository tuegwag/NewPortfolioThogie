 document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM loaded');
            
            // Mobile menu toggle
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const navLinks = document.getElementById('navLinks');

            console.log('mobileMenuBtn:', mobileMenuBtn);
            console.log('navLinks:', navLinks);

            if (mobileMenuBtn && navLinks) {
                mobileMenuBtn.addEventListener('click', function(e) {
                    console.log('Button clicked!');
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Current classes:', navLinks.className);
                    navLinks.classList.toggle('active');
                    console.log('New classes:', navLinks.className);
                });
            } else {
                console.log('Button or nav not found!');
            }

            // Close menu when clicking on a link
            if (navLinks) {
                document.querySelectorAll('nav a').forEach(link => {
                    link.addEventListener('click', () => {
                        navLinks.classList.remove('active');
                    });
                });
            }

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (navLinks && !e.target.closest('nav') && !e.target.closest('.mobile-menu-btn')) {
                    navLinks.classList.remove('active');
                }
            });
            // Scroll animations
            const observerOptions = {
                threshold: 0.2,
                rootMargin: '0px 0px -100px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, observerOptions);

            // Observe all animated elements (support dash + underscore class names across pages)
            const animatables = document.querySelectorAll('.slide_left, .slide_right, .shape_slide_left, .shape_slide_right, .slide-left, .slide-right');
            animatables.forEach(el => {
                observer.observe(el);

                // If already in view on load (e.g., hero shapes), animate immediately
                const rect = el.getBoundingClientRect();
                const inView = rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;
                if (inView) {
                    el.classList.add('animated');
                }
            });

            // Fallback: always force shapes to animate so they become visible even if the observer misses
            document.querySelectorAll('.shape_slide_left, .shape_slide_right, .shape-slide-left, .shape-slide-right').forEach(shape => {
                shape.classList.add('animated');
            });
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });