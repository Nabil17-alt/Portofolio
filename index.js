/**
 * Personal Portfolio App Logic
 * Muhammad Nabil
 */

// --- 1. Typing Effect Logic ---
function initTypingEffect() {
    const textSpan = document.querySelector('.efek-ngetik');
    if (!textSpan) return;

    const phrases = [
        "Muhammad Nabil",
        "an Informatics Student",
        "a Web Developer",
        "a Creative Problem Solver"
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 150;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            textSpan.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            delay = 50;
        } else {
            textSpan.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            delay = 120;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            delay = 1800; // Pause at end of phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 500; // Pause before starting next phrase
        }

        setTimeout(type, delay);
    }

    // Start typewriter
    setTimeout(type, 500);
}

// --- 2. Scroll Animations (Intersection Observer) ---
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-up-element');
    
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('element-visible');
                // Unobserve once animated
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

// --- 3. Dynamic Active Navigation Indicator on Scroll ---
function initActiveNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200; // Offset for header

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

// --- 4. Sticky Header & Back to Top Toggle ---
function initHeaderAndScrollTop() {
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    window.addEventListener('scroll', () => {
        // Header Sticky state
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Scroll Top Button active state
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('scroll-active');
        } else {
            scrollTopBtn.classList.remove('scroll-active');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- 5. Mobile Navigation Menu Toggle ---
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !navbar) return;

    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('open-menu');
        menuToggle.classList.toggle('bx-x'); // Optionally change icon if needed
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('open-menu');
        });
    });

    // Close menu on scroll
    window.addEventListener('scroll', () => {
        navbar.classList.remove('open-menu');
    });
}

// --- 6. GitHub Repositories Fetcher & Dynamic Renderer ---
const LANGUAGE_COLORS = {
    javascript: '#f1e05a',
    html: '#e34c26',
    css: '#563d7c',
    python: '#3572A5',
    typescript: '#3178c6',
    php: '#4f5d95',
    vue: '#41b883',
    react: '#61dafb',
    java: '#b07219',
    go: '#00ADD8'
};

const MOCK_REPOSITORIES = [
    {
        name: 'Informatics-Portal',
        description: 'A comprehensive academic dashboard developed for informatics students to coordinate database files and project workflows.',
        html_url: 'https://github.com/Nabil17-alt/Informatics-Portal',
        language: 'JavaScript',
        stargazers_count: 5
    },
    {
        name: 'Smart-Inventory-System',
        description: 'An automated supply and inventory tracking application built using Python, SQLite, and customized responsive UI interfaces.',
        html_url: 'https://github.com/Nabil17-alt/Smart-Inventory-System',
        language: 'Python',
        stargazers_count: 3
    },
    {
        name: 'Advanced-Portfolio-Redesign',
        description: 'A professional and premium space-themed portfolio featuring glassmorphic designs, responsive animations, and integration interfaces.',
        html_url: 'https://github.com/Nabil17-alt/Portofolio',
        language: 'CSS',
        stargazers_count: 4
    }
];

async function loadGitHubProjects() {
    const username = 'Nabil17-alt';
    const container = document.getElementById('github-projects');
    if (!container) return;

    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
        
        if (!res.ok) {
            throw new Error('API request failed');
        }

        const repos = await res.json();
        
        // Filter out forks
        const ownRepos = repos.filter(repo => !repo.fork);

        if (ownRepos.length === 0) {
            renderMockProjects(container);
            return;
        }

        container.innerHTML = '';
        ownRepos.forEach(repo => {
            renderProjectCard(container, repo);
        });

    } catch (e) {
        console.warn('Unable to load GitHub repositories. Loading premium mock projects instead.', e);
        renderMockProjects(container);
    }
}

function renderMockProjects(container) {
    container.innerHTML = '';
    MOCK_REPOSITORIES.forEach(repo => {
        renderProjectCard(container, repo);
    });
}

function renderProjectCard(container, repo) {
    const lang = repo.language ? repo.language : 'Code';
    const langLower = lang.toLowerCase();
    const dotColor = LANGUAGE_COLORS[langLower] || '#818cf8';
    
    // Generate static visual gradient theme based on project name length to look premium
    const gradIndex = (repo.name.length % 5) + 1;
    const gradients = [
        'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        'linear-gradient(135deg, #a855f7, #ec4899)',
        'linear-gradient(135deg, #06b6d4, #3b82f6)',
        'linear-gradient(135deg, #10b981, #059669)',
        'linear-gradient(135deg, #f59e0b, #e11d48)'
    ];
    const cardGrad = gradients[gradIndex - 1];

    const html = `
        <div class="portofolio-box">
            <div class="portofolio-img-wrapper" style="background: ${cardGrad};">
                <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; opacity:0.15;">
                    <i class="bx bx-code-block" style="font-size: 5rem; color:#fff;"></i>
                </div>
                <div class="portofolio-overlay">
                    <span style="color:#fff; font-size: 0.85rem; font-weight:600; background:rgba(0,0,0,0.4); padding:0.4rem 1rem; border-radius:100px; border:1px solid rgba(255,255,255,0.1); margin-bottom: 0.5rem;">
                        <i class="bx bx-star"></i> Stars: ${repo.stargazers_count || 0}
                    </span>
                </div>
            </div>
            <div class="portofolio-info">
                <h2>${repo.name.replace(/-/g, ' ')}</h2>
                <p>${repo.description ? repo.description : 'No description provided. Click the link to explore the source code repository on GitHub.'}</p>
                <div class="portofolio-meta">
                    <div class="portofolio-lang">
                        <span class="lang-dot" style="background-color: ${dotColor};"></span>
                        <span>${lang}</span>
                    </div>
                    <a href="${repo.html_url}" target="_blank" rel="noopener" class="portofolio-link" aria-label="View Project Source Code">
                        <i class="bx bx-arrow-to-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

// --- 7. Local Contact Logger Database Logic ---
function renderContactLog() {
    const logList = document.getElementById('contact-log-list');
    if (!logList) return;

    const logs = JSON.parse(localStorage.getItem('contact_log') || '[]');
    logList.innerHTML = '';

    if (logs.length === 0) {
        logList.innerHTML = `
            <div style="color: var(--text-muted); font-size:0.85rem; text-align:center; padding: 1.5rem 0;">
                <i class="bx bx-data" style="font-size: 1.8rem; display:block; margin-bottom: 0.3rem;"></i>
                No contact submissions found in LocalStorage.
            </div>
        `;
        return;
    }

    // Display logs sorted from newest
    logs.slice().reverse().forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'contact-log-item';
        itemEl.innerHTML = `
            <div class="contact-log-meta">
                <span class="contact-log-name">${escapeHTML(item.name)} &lt;${escapeHTML(item.email)}&gt;</span>
                <span>${item.time}</span>
            </div>
            <div class="contact-log-message">${escapeHTML(item.message)}</div>
        `;
        logList.appendChild(itemEl);
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nameInput = contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !email || !message) return;

        const logs = JSON.parse(localStorage.getItem('contact_log') || '[]');
        logs.push({
            name,
            email,
            message,
            time: new Date().toLocaleString()
        });

        localStorage.setItem('contact_log', JSON.stringify(logs));
        contactForm.reset();
        renderContactLog();
        
        // Show stylish modal or notification
        alert(`Thank you, ${name}! Your message has been logged to the Local Console successfully.`);
    });

    // Toggle contact log display
    const logToggle = document.getElementById('contact-log-toggle');
    const logBox = document.getElementById('contact-log-box');

    if (logToggle && logBox) {
        logToggle.addEventListener('click', () => {
            logToggle.classList.toggle('open');
            logBox.classList.toggle('open');
        });
    }

    renderContactLog();
}

// --- 8. Dynamic Copyright Year ---
function initFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// --- DOM Initialization ---
window.addEventListener('DOMContentLoaded', () => {
    initFooterYear();
    initHeaderAndScrollTop();
    initMobileMenu();
    initTypingEffect();
    initScrollAnimations();
    initActiveNavOnScroll();
    initContactForm();
    loadGitHubProjects();
});