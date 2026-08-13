function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  const observerOptions = {
    root: null,          // Uses the viewport
    threshold: 0.15,     // Triggers when 15% of the element is visible
    rootMargin: '0px 0px -40px 0px' // Triggers slightly before reaching the bottom edge
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add the active class to trigger the CSS transition
        entry.target.classList.add('active');
        
        // Stop observing this element so it stays revealed permanently
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => revealObserver.observe(el));
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollReveal);
} else {
  initScrollReveal();
}