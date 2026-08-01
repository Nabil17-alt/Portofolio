/**
 * Portofolio Aplikasi Web & Mobile - Application Logic
 * Muhammad Nabil, S.Kom
 */

// --- 1. Top Scroll Progress Bar ---
function initScrollProgressBar() {
    const progressBar = document.getElementById('scroll-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${scrollPercent}%`;
    });
}

// --- 2. Hero Section Typing Effect ---
function initTypingEffect() {
    const typingTextEl = document.getElementById('typing-text');
    if (!typingTextEl) return;

    const roles = [
        "Software Engineer",
        "Laravel Developer",
        "Android Developer",
        "IT Specialist"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before new word
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

// --- 3. Scroll Reveal & Skill Progress Fill Observer ---
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-up-element');

    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('element-visible');

                // Trigger skill progress bar animations when skills section appears
                const skillFills = entry.target.querySelectorAll('.skill-progress-fill');
                skillFills.forEach(fill => {
                    const targetWidth = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = targetWidth;
                    }, 100);
                });

                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

// --- 4. Active Navigation Indicator on Scroll ---
function initActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 220;

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

// --- 5. Sticky Header & Back To Top Handler ---
function initHeaderAndScrollTop() {
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

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

// --- 6. Mobile Navigation Menu Toggle ---
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !navbar) return;

    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('open-menu');
        menuToggle.classList.toggle('active-menu');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('open-menu');
            menuToggle.classList.remove('active-menu');
        });
    });

    window.addEventListener('scroll', () => {
        navbar.classList.remove('open-menu');
        menuToggle.classList.remove('active-menu');
    });
}

// --- 7. GitHub Projects Synchronizer & Fallback ---
const LANGUAGE_COLORS = {
    javascript: '#f1e05a',
    html: '#e34c26',
    css: '#563d7c',
    python: '#3572A5',
    typescript: '#3178c6',
    php: '#4f5d95',
    kotlin: '#7f52ff',
    java: '#b07219'
};

async function loadGitHubProjects() {
    const username = 'Nabil17-alt';
    const container = document.getElementById('github-projects');
    if (!container) return;

    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);

        if (!res.ok) throw new Error('Permintaan API GitHub gagal');

        const repos = await res.json();
        const ownRepos = repos.filter(repo => !repo.fork && !['PTPN4Regional3', 'INJUREAL', 'Skripsi-Muhammad-Nabil'].includes(repo.name));

        if (ownRepos.length === 0) return;

        container.innerHTML = '';
        ownRepos.forEach(repo => {
            renderDynamicRepoCard(container, repo);
        });

    } catch (e) {
        console.warn('Menggunakan data proyek utama lokal.', e);
    }
}

function renderDynamicRepoCard(container, repo) {
    const lang = repo.language ? repo.language : 'Kode';
    const langLower = lang.toLowerCase();
    const dotColor = LANGUAGE_COLORS[langLower] || '#6366f1';

    const html = `
        <div class="project-card fade-up-element element-visible">
            <div class="project-img-box">
                <div class="project-gradient-bg" style="background: linear-gradient(135deg, #1e293b, #334155);">
                    <i class="bx bx-code-block project-icon-preview"></i>
                </div>
                <span class="project-status-badge status-completed">GitHub Repo</span>
            </div>
            <div class="project-body">
                <div>
                    <div class="project-header-row">
                        <h3 class="project-title">${escapeHTML(repo.name.replace(/-/g, ' '))}</h3>
                    </div>
                    <p class="project-desc">${repo.description ? escapeHTML(repo.description) : 'Repositori kode publik pada profil GitHub Muhammad Nabil.'}</p>
                    
                    <div class="project-tech-tags">
                        <span class="tech-tag" style="border-color:${dotColor}; color:#fff;">
                            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${dotColor}; margin-right:4px;"></span>
                            ${lang}
                        </span>
                        <span class="tech-tag"><i class="bx bx-star"></i> ${repo.stargazers_count || 0} Stars</span>
                    </div>
                </div>

                <div class="project-footer-row">
                    <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-link-btn">
                        <i class="bx bxl-github"></i> Lihat Repository <i class="bx bx-right-arrow-alt"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

// --- 8. Contact Form Local Database Storage Logger ---
function renderContactLog() {
    const logList = document.getElementById('contact-log-list');
    if (!logList) return;

    const logs = JSON.parse(localStorage.getItem('contact_log') || '[]');
    logList.innerHTML = '';

    if (logs.length === 0) {
        logList.innerHTML = `
            <div style="color: var(--text-muted); font-size:0.85rem; text-align:center; padding: 1rem 0;">
                <i class="bx bx-data" style="font-size: 1.5rem; display:block; margin-bottom: 0.3rem; color:var(--primary);"></i>
                Belum ada pesan yang tersimpan di Database Log Lokal.
            </div>
        `;
        return;
    }

    logs.slice().reverse().forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'contact-log-item';
        itemEl.innerHTML = `
            <div class="contact-log-meta">
                <strong>${escapeHTML(item.name)}</strong> &lt;${escapeHTML(item.email)}&gt; • <span>${item.time}</span>
            </div>
            <div>"${escapeHTML(item.message)}"</div>
        `;
        logList.appendChild(itemEl);
    });
}

function escapeHTML(str) {
    if (!str) return '';
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
            time: new Date().toLocaleString('id-ID')
        });

        localStorage.setItem('contact_log', JSON.stringify(logs));
        contactForm.reset();
        renderContactLog();

        alert(`Terima kasih, ${name}! Pesan Anda telah berhasil dicatat pada Database Log Lokal.`);
    });

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

// --- 9. Dynamic Copyright Year ---
function initFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// --- DOM Initialization ---
window.addEventListener('DOMContentLoaded', () => {
    initScrollProgressBar();
    initTypingEffect();
    initFooterYear();
    initHeaderAndScrollTop();
    initMobileMenu();

    initScrollAnimations();
    initActiveNavOnScroll();
    initContactForm();
    loadGitHubProjects();
});