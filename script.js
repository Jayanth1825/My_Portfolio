/* ============================================================
   PORTFOLIO — script.js
   Theme toggle, scroll reveal, navbar, contact form, active nav
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── DOM References ── */
  const navbar       = document.getElementById('navbar');
  const themeToggle  = document.getElementById('themeToggle');
  const hamburger    = document.getElementById('hamburger');
  const navLinks     = document.getElementById('navLinks');
  const contactForm  = document.getElementById('contactForm');
  const htmlEl       = document.documentElement;

  /* ══════════════════════════════════
     THEME TOGGLE (Dark / Light)
     ══════════════════════════════════ */
  const THEME_KEY = 'portfolio-theme';

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Load saved theme
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ══════════════════════════════════
     NAVBAR — SHRINK ON SCROLL
     ══════════════════════════════════ */
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  /* ══════════════════════════════════
     HAMBURGER MENU (Mobile)
     ══════════════════════════════════ */
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function toggleMenu() {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    overlay.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ══════════════════════════════════
     SCROLL REVEAL (IntersectionObserver)
     ══════════════════════════════════ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ══════════════════════════════════
     ACTIVE NAV LINK HIGHLIGHTING
     ══════════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinksAll.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ══════════════════════════════════
     CONTACT FORM — Client-Side Validation
     ══════════════════════════════════ */
  const nameInput    = document.getElementById('contactName');
  const emailInput   = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const nameError    = document.getElementById('nameError');
  const emailError   = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateForm() {
    let valid = true;

    // Name
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      valid = false;
    } else {
      nameError.textContent = '';
    }

    // Email
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Please enter your email.';
      valid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      valid = false;
    } else {
      emailError.textContent = '';
    }

    // Message
    if (!messageInput.value.trim()) {
      messageError.textContent = 'Please enter a message.';
      valid = false;
    } else {
      messageError.textContent = '';
    }

    return valid;
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm()) {
      alert('Thank you for your message! I will get back to you soon. 🚀');
      contactForm.reset();
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';
    }
  });

  // Live validation on blur
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('blur', validateForm);
  });

  /* ══════════════════════════════════
     SMOOTH SCROLL for anchor links
     (native scroll-behavior: smooth handles this,
      but we ensure proper offset for mobile too)
     ══════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const yOffset = -80;
        const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

});
