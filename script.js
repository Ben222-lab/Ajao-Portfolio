// Tell the CSS that JavaScript is working (needed for the reveal effect)
document.body.classList.add('js');

// Find the elements we need
const header = document.getElementById('siteHeader');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link-item');
const sections = document.querySelectorAll('main section');
const backToTop = document.getElementById('backToTop');

// Show the current year in the footer
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Mobile menu =====
function setMenu(isOpen) {
  navMenu.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

navToggle.addEventListener('click', function () {
  setMenu(!navMenu.classList.contains('open'));
});

// Close the menu when a link is clicked
navLinks.forEach(function (link) {
  link.addEventListener('click', function () { setMenu(false); });
});

// Close the menu with the Escape key
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') setMenu(false);
});

// ===== Things that change while scrolling =====
window.addEventListener('scroll', function () {
  // Dark header background after scrolling a little
  header.classList.toggle('scrolled', window.scrollY > 20);

  // Show the back-to-top button after scrolling down
  backToTop.classList.toggle('visible', window.scrollY > 600);

  // Highlight the menu link of the section you are viewing
  let currentId = 'home';
  sections.forEach(function (section) {
    if (window.scrollY >= section.offsetTop - 150) currentId = section.id;
  });
  navLinks.forEach(function (link) {
    link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
  });
});

backToTop.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Reveal items when they scroll into view =====
const observer = new IntersectionObserver(function (items) {
  items.forEach(function (item) {
    if (item.isIntersecting) {
      item.target.classList.add('show');
      observer.unobserve(item.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(function (element) {
  observer.observe(element);
});

// ===== Contact form =====
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// Show (or clear) an error under one field. Returns true when the field is OK.
function checkField(id, isValid, message) {
  document.getElementById(id + 'Error').textContent = isValid ? '' : message;
  document.getElementById(id).setAttribute('aria-invalid', !isValid);
  return isValid;
}

form.addEventListener('submit', function (event) {
  event.preventDefault(); // stop the page from reloading

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  const nameOk = checkField('name', name.length >= 2, 'Enter your name.');
  const emailOk = checkField('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Enter a valid email address.');
  const subjectOk = checkField('subject', subject.length >= 3, 'Enter a subject.');
  const messageOk = checkField('message', message.length >= 10, 'Write at least 10 characters.');

  if (!(nameOk && emailOk && subjectOk && messageOk)) {
    formStatus.textContent = 'Please fix the highlighted fields.';
    return;
  }

  // Build an email link and open the visitor's email app
  const body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
  window.location.href = 'mailto:benjaminajao02@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

  formStatus.textContent = 'Your email app should open. Nothing is sent until you press Send there.';
});