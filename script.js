// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  document.getElementById('backToTop').classList.toggle('show', window.scrollY > 400);
});

// ===== ACTIVE NAV LINK =====
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 90) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

// ===== HAMBURGER MENU =====
function toggleMenu() {
  const links = document.getElementById('navLinks');
  links.classList.toggle('open');
}

// ===== MODAL =====
function openModal(type) {
  document.getElementById(type + 'Modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(type) {
  document.getElementById(type + 'Modal').classList.remove('active');
  document.body.style.overflow = '';
}

function switchModal(from, to) {
  closeModal(from);
  setTimeout(() => openModal(to), 200);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ['signin', 'signup'].forEach(closeModal);
  }
});

// ===== TOGGLE PASSWORD =====
function togglePass(id) {
  const inp = document.getElementById(id);
  const btn = inp.nextElementSibling;
  const icon = btn.querySelector('i');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    inp.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

// ===== BACK TO TOP =====
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      document.getElementById('navLinks').classList.remove('open');
    }
  });
});

// ===== ANIMATE ON SCROLL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .job-card, .testimonial-card, .contact-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});

// ===== CONTACT FORM SUBMIT =====
document.querySelector('.contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
  btn.style.background = '#16a34a';
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
    this.reset();
  }, 3000);
});

// ===== SIGNIN FORM =====
document.querySelector('#signinModal .modal-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Welcome Back!';
    btn.style.background = '#16a34a';
    setTimeout(() => {
      closeModal('signin');
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.background = '';
    }, 1500);
  }, 1200);
});

// ===== SIGNUP FORM =====
document.querySelector('#signupModal .modal-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Account Created!';
    btn.style.background = '#16a34a';
    setTimeout(() => {
      closeModal('signup');
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.background = '';
    }, 1500);
  }, 1400);
});

// ===== SEARCH FORM =====
const searchBtn = document.querySelector('.search-btn');
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const jobsSection = document.getElementById('jobs');
    const offset = 80;
    const top = jobsSection.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}
