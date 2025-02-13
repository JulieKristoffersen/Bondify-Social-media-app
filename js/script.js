document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.querySelector('#menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  menuBtn.addEventListener('click', function () {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
      mobileMenu.setAttribute('aria-hidden', isExpanded);
  });
});
