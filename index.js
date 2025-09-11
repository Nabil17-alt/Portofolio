async function loadGitHubProjects() {
  const username = 'Nabil17-alt';
  const container = document.getElementById('github-projects');
  if (!container) return;
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
    const repos = await res.json();
    container.innerHTML = '';
    repos.forEach(repo => {
      if (repo.fork) return;
      const imgUrl = './pages/img/portofolio.png';
      const html = `
        <div class="portofolio-box">
          <img src="${imgUrl}" alt="${repo.name}" class="portofolio-img" loading="lazy">
          <div class="portofolio-overlay">
            <h2>${repo.name}</h2>
            <p style='font-size:0.9rem;margin-bottom:0.5rem;'>${repo.description ? repo.description : ''}</p>
            <a href="${repo.html_url}" target="_blank" rel="noopener" aria-label="${repo.name} GitHub">
              <i class="bx bx-link-alt"></i>
            </a>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', html);
    });
  } catch (e) {
    container.innerHTML = '<p style="color:#fff">Failed to load projects from GitHub.</p>';
  }
}

window.addEventListener('DOMContentLoaded', loadGitHubProjects);

function renderContactLog() {
  const logList = document.getElementById('contact-log-list');
  if (!logList) return;
  const logs = JSON.parse(localStorage.getItem('contact_log') || '[]');
  logList.innerHTML = '';
  if (logs.length === 0) {
    logList.innerHTML = '<li style="color:#aaa">Belum ada yang mengontak.</li>';
    return;
  }
  logs.slice().reverse().forEach(item => {
    const li = document.createElement('li');
    li.style.marginBottom = '0.5rem';
    li.innerHTML = `<b>${item.name}</b> &lt;${item.email}&gt; <br><span style='font-size:0.95em'>${item.message}</span> <br><span style='font-size:0.8em;color:#aaa'>${item.time}</span>`;
    logList.appendChild(li);
  });
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = contactForm.querySelector('input[name="name"]').value.trim();
    const email = contactForm.querySelector('input[name="email"]').value.trim();
    const message = contactForm.querySelector('textarea[name="message"]').value.trim();
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
    alert('Pesan Anda sudah tercatat');
  });
  renderContactLog();
}

const menu = document.querySelector('.menu-icon');
const navbar = document.querySelector('.navbar');
menu.onclick = () => {
  navbar.classList.toggle('open-menu');
  menu.classList.toggle('move');
};
window.onscroll = () => {
  navbar.classList.remove('open-menu');
  menu.classList.remove('move');
};

const txtElement = ['Muhammad Nabil'];
let count = 0;
let txtIndex = 0;
let currentTxt = '';
let words = '';
(function ngetik() {
  if (count === txtElement.length) {
    count = 0;
  }
  currentTxt = txtElement[count];
  words = currentTxt.slice(0, ++txtIndex);
  document.querySelector('.efek-ngetik').textContent = words;
  if (words.length === currentTxt.length) {
    count++;
    txtIndex = 0;
  }
  setTimeout(ngetik, 500);
})();

const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('header-active', window.scrollY > 0);
});
const scrollTop = document.querySelector('.scroll-top');
window.addEventListener('scroll', () => {
  scrollTop.classList.toggle('scroll-active', window.scrollY >= 400);
});