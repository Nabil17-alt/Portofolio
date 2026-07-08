/**
 * Muhammad Nabil Arkan Group (MNA Group)
 * Corporate Holding Profile Script Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initStickyHeader();
    initMobileMenu();
    initActiveNavOnScroll();
    initStatsCounter();
    initContactForm();
    initFooterYear();
});

// --- 1. Dark/Light Theme Switcher Logic ---
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    if (!toggleBtn || !themeIcon) return;

    // Check saved theme preferences, default to dark
    const savedTheme = localStorage.getItem('mna_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, themeIcon);

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('mna_theme', newTheme);
        updateThemeIcon(newTheme, themeIcon);
    });
}

function updateThemeIcon(theme, iconElement) {
    if (theme === 'light') {
        iconElement.className = 'bx bx-moon'; // Moon icon to switch to dark
    } else {
        iconElement.className = 'bx bx-sun';  // Sun icon to switch to light
    }
}

// --- 2. Sticky Header ---
function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
}

// --- 3. Mobile Navigation Menu ---
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !navbar) return;

    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('open-menu');
        menuToggle.classList.toggle('active-menu');
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('open-menu');
            menuToggle.classList.remove('active-menu');
        });
    });

    // Close menu on scroll
    window.addEventListener('scroll', () => {
        navbar.classList.remove('open-menu');
        menuToggle.classList.remove('active-menu');
    });
}

// --- 4. Scroll Spy Navigation Highlight ---
function initActiveNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200; // Offset for sticky navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

// --- 5. Statistics Count-Up Animation (Intersection Observer) ---
function initStatsCounter() {
    const statNums = document.querySelectorAll('.stat-num');
    if (statNums.length === 0) return;

    const options = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        let current = 0;
        const duration = 1500; // Duration of animation in ms
        const increment = Math.ceil(target / (duration / 16)); // Target approx 60 FPS

        const animate = () => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
            } else {
                element.textContent = current.toLocaleString();
                requestAnimationFrame(animate);
            }
        };

        animate();
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                obs.unobserve(entry.target); // Animate only once
            }
        });
    }, options);

    statNums.forEach(num => {
        observer.observe(num);
    });
}

// --- 6. Corporate Contact Form Submission desk ---
function initContactForm() {
    const form = document.getElementById('holding-contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');
        const messageInput = form.querySelector('textarea[name="message"]');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !email || !message) return;

        // Log inquiries into local storage under 'mna_inquiries'
        const inquiries = JSON.parse(localStorage.getItem('mna_inquiries') || '[]');
        inquiries.push({
            name,
            email,
            message,
            time: new Date().toLocaleString()
        });

        localStorage.setItem('mna_inquiries', JSON.stringify(inquiries));
        form.reset();

        alert(`Thank you, ${name}. Your business inquiry has been recorded and submitted to MNA Group headquarters successfully.`);
    });
}

// --- 7. Footer Copyright Year ---
function initFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
