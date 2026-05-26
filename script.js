// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Active navigation highlighting on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('header nav ul li a');

function setActiveLink() {
    let scrollPosition = window.scrollY + 100; // Adjust for header height

    sections.forEach(section => {
        if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
            const currentId = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(currentId)) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);

// Mobile menu toggle (optional enhancement)
const hamburger = document.createElement('div');
hamburger.classList.add('hamburger');
hamburger.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
`;
document.querySelector('header .container').insertBefore(hamburger, document.querySelector('header nav'));

const nav = document.querySelector('header nav');
hamburger.addEventListener('click', () => {
    nav.classList.toggle('mobile-active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a nav link (on mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            nav.classList.remove('mobile-active');
            hamburger.classList.remove('active');
        }
    });
});